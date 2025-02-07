import UserModel from '../../db/userModel';
import axios, { AxiosError } from 'axios';

interface DropboxFolder {
    ".tag": "folder";
    name: string;
    path_display: string;
    id: string;
}

interface FolderCreatedResult {
    message: string;
    name: string;
}

const knownFolderPaths = new Set<string>();
let lastExecutionTime = 0;
const EXECUTION_DELAY = 5000;
let isInitialized = false;

export const folderCreated_dropbox = async (email: string): Promise<FolderCreatedResult | null> => {
    try {
        const currentTime = Date.now();
        if (currentTime - lastExecutionTime < EXECUTION_DELAY) {
            console.log('⏳ Vérification ignorée : trop tôt depuis la dernière exécution');
            return null;
        }
        lastExecutionTime = currentTime;

        console.log('🔍 Vérification des nouveaux dossiers Dropbox pour:', email);
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`Utilisateur avec l'email "${email}" non trouvé`);
        }

        const apiKeysMap = user.apiKeys as Map<string, string>;
        const dropboxToken = apiKeysMap.get('dropbox');

        if (!dropboxToken) {
            throw new Error('Token Dropbox manquant');
        }

        const response = await axios.post(
            'https://api.dropboxapi.com/2/files/list_folder',
            {
                path: "",
                recursive: false,
                include_mounted_folders: true,
                include_non_downloadable_files: true
            },
            {
                headers: {
                    'Authorization': `Bearer ${dropboxToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const currentFolders = response.data.entries
            .filter((entry: DropboxFolder) => entry['.tag'] === 'folder')
            .map((folder: DropboxFolder) => folder.path_display);

        console.log('📂 Dossiers actuels:', currentFolders);

        if (!isInitialized) {
            currentFolders.forEach((path: string) => knownFolderPaths.add(path));
            isInitialized = true;
            console.log('🚀 Première exécution - Initialisation avec les dossiers:', Array.from(knownFolderPaths));
            return null;
        }

        const newFolders = currentFolders.filter((path: string) => !knownFolderPaths.has(path));
        
        currentFolders.forEach((path: string) => knownFolderPaths.add(path));

        if (newFolders.length > 0) {
            const newFolder = newFolders[0];
            const folderName = newFolder.split('/').pop() || 'unknown';
            
            console.log('✨ Nouveau dossier détecté:', {
                name: folderName,
                path: newFolder
            });

            return {
                message: `📁 Nouveau dossier Dropbox créé:\nNom: ${folderName}\nChemin: ${newFolder}`,
                name: folderName
            };
        }

        console.log('😴 Aucun nouveau dossier détecté');
        return null;

    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('❌ Erreur dans folderCreated_dropbox:', {
            name: axiosError.name,
            message: axiosError.message,
            response: axiosError.response?.data
        });
        
        if (axiosError.response?.status === 401) {
            throw new Error('Token Dropbox invalide ou expiré');
        }
        
        throw new Error('Erreur lors de la vérification des dossiers Dropbox');
    }
};