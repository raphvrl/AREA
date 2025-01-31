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

let knownFolderPaths: string[] = [];
let isInitialized = false;

export const folderCreated_dropbox = async (email: string): Promise<FolderCreatedResult | null> => {
    try {
        console.log('Checking for new Dropbox folders for user:', email);
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        const apiKeysMap = user.apiKeys as Map<string, string>;
        const dropboxToken = apiKeysMap.get('dropbox');

        if (!dropboxToken) {
            throw new Error(`Dropbox token missing for user "${email}".`);
        }

        console.log('Making request to Dropbox API...');
        const response = await axios.post('https://api.dropboxapi.com/2/files/list_folder', 
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

        // Filtrer pour ne garder que les dossiers
        const folders = response.data.entries.filter((entry: any) => entry['.tag'] === 'folder') as DropboxFolder[];
        const currentFolderPaths = folders.map((folder: DropboxFolder) => folder.path_display);

        console.log('Current folders:', currentFolderPaths);

        if (!isInitialized) {
            knownFolderPaths = currentFolderPaths;
            isInitialized = true;
            console.log('First run - Initialized with folders:', knownFolderPaths);
            return null;
        }

        // Trouver les nouveaux dossiers
        const newFolders = folders.filter((folder: DropboxFolder) => !knownFolderPaths.includes(folder.path_display));

        if (newFolders.length > 0) {
            const latestFolder = newFolders[0];
            knownFolderPaths = currentFolderPaths;
            
            console.log('New folder detected:', {
                name: latestFolder.name,
                path: latestFolder.path_display
            });

            return {
                message: `📁 Nouveau dossier Dropbox créé:\nNom: ${latestFolder.name}\nChemin: ${latestFolder.path_display}`,
                name: latestFolder.name
            };
        }

        console.log('No new folders detected');
        return null;

    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error details:', {
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