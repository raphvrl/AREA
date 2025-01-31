import UserModel from '../../db/userModel';
import axios, { AxiosError } from 'axios';

interface DropboxFile {
    id: string;
    name: string;
    path_display: string;
    size: number;
    server_modified: string;
}

interface FileUploadedResult {
    message: string;
    name: string;
}

let lastModifiedTime: string | null = null;
let isInitialized = false;

export const fileUploaded_dropbox = async (email: string): Promise<FileUploadedResult | null> => {
    try {
        console.log('📂 Vérification des nouveaux fichiers Dropbox pour:', email);
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        const apiKeysMap = user.apiKeys as Map<string, string>;
        const dropboxToken = apiKeysMap.get('dropbox');

        if (!dropboxToken) {
            throw new Error(`Dropbox token missing for user "${email}".`);
        }

        console.log('🔍 Requête vers l\'API Dropbox...');
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

        console.log('📊 Réponse de l\'API Dropbox:', {
            hasEntries: !!response.data.entries,
            numberOfFiles: response.data.entries?.length || 0,
        });

        if (!response.data.entries || !response.data.entries.length) {
            console.log('❌ Aucun fichier trouvé dans Dropbox');
            return null;
        }

        // Trier les fichiers par date de modification (du plus récent au plus ancien)
        const sortedFiles = response.data.entries
            .filter((file: any) => file['.tag'] === 'file')
            .sort((a: DropboxFile, b: DropboxFile) => 
                new Date(b.server_modified).getTime() - new Date(a.server_modified).getTime()
            );

        console.log('📄 Derniers fichiers dans Dropbox:');
        sortedFiles.slice(0, 5).forEach((file: DropboxFile, index: number) => {
            console.log(`${index + 1}. Nom: ${file.name}, Modifié: ${file.server_modified}, Chemin: ${file.path_display}`);
        });

        const latestFile = sortedFiles[0] as DropboxFile;
        console.log('📝 Détails du dernier fichier:', {
            name: latestFile.name,
            modified: latestFile.server_modified,
            path: latestFile.path_display,
            size: latestFile.size
        });

        if (!isInitialized) {
            lastModifiedTime = latestFile.server_modified;
            isInitialized = true;
            console.log('🚀 Première exécution - Initialisation avec:', {
                name: latestFile.name,
                modified: lastModifiedTime
            });
            return null;
        }

        console.log('⏱️ Comparaison des dates de modification:', {
            lastModifiedTime: lastModifiedTime,
            newModifiedTime: latestFile.server_modified,
            isNewer: new Date(latestFile.server_modified) > new Date(lastModifiedTime!)
        });

        if (new Date(latestFile.server_modified) > new Date(lastModifiedTime!)) {
            lastModifiedTime = latestFile.server_modified;
            console.log('✨ Nouveau fichier détecté!', {
                name: latestFile.name,
                path: latestFile.path_display,
                size: latestFile.size,
                modified: latestFile.server_modified
            });

            return {
                message: `📁 Nouveau fichier Dropbox détecté:\nNom: ${latestFile.name}\nChemin: ${latestFile.path_display}\nTaille: ${(latestFile.size / 1024).toFixed(2)} KB`,
                name: latestFile.name
            };
        }

        console.log('😴 Aucun nouveau fichier détecté');
        return null;

    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('❌ Erreur dans fileUploaded_dropbox:', {
            name: axiosError.name,
            message: axiosError.message,
            response: axiosError.response?.data
        });
        
        if (axiosError.response?.status === 401) {
            throw new Error('Token Dropbox invalide ou expiré');
        }
        
        throw new Error('Erreur lors de la vérification des fichiers Dropbox');
    }
};
