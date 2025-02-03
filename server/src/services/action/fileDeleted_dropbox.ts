import UserModel from '../../db/userModel';
import axios, { AxiosError } from 'axios';

interface DropboxFile {
    ".tag": string;
    name: string;
    path_display: string;
    id: string;
}

interface DropboxResult {
    message: string;
    name: string;
}

let knownFilePaths: Set<string> = new Set();
let isInitialized = false;

export const fileDeleted_dropbox = async (email: string): Promise<DropboxResult | null> => {
    try {
        console.log('Checking for deleted Dropbox files for user:', email);
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
                include_non_downloadable_files: true,
                include_deleted: true
            },
            {
                headers: {
                    'Authorization': `Bearer ${dropboxToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Récupérer tous les fichiers actuels (non supprimés)
        const currentFiles = response.data.entries.filter((entry: any) => entry['.tag'] !== 'deleted') as DropboxFile[];
        const currentFilePaths = new Set(currentFiles.map((file: DropboxFile) => file.path_display));

        console.log('Current files count:', currentFilePaths.size);

        if (!isInitialized) {
            knownFilePaths = currentFilePaths;
            isInitialized = true;
            console.log('First run - Initialized with files:', knownFilePaths.size);
            return null;
        }

        // Trouver les fichiers supprimés (présents dans knownFilePaths mais pas dans currentFilePaths)
        const deletedFiles = Array.from(knownFilePaths).filter(path => !currentFilePaths.has(path));

        if (deletedFiles.length > 0) {
            const deletedFile = deletedFiles[0];
            console.log('File deletion detected:', {
                path: deletedFile
            });

            // Mettre à jour la liste des fichiers connus
            knownFilePaths = currentFilePaths;

            return {
                message: `🗑️ Fichier Dropbox supprimé:\nChemin: ${deletedFile}`,
                name: deletedFile.split('/').pop() || 'unknown'
            };
        }

        // Mettre à jour la liste des fichiers connus
        knownFilePaths = currentFilePaths;
        console.log('No deleted files detected');
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
        
        throw new Error('Erreur lors de la vérification des fichiers supprimés Dropbox');
    }
};
