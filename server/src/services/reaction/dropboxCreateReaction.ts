import axios from 'axios';
import userModel from '../../db/userModel';

interface DropboxResponse {
  message: string;
}

// Variables de contrôle
const createdFolders = new Set<string>();
let lastFolderCreationTime = 0;
const CREATION_COOLDOWN = 5000;
let isCreatingFolder = false;

export const createFolder_dropbox = async (
  email: string,
  option: string,
  actionResult?: any
): Promise<DropboxResponse | null> => {
  try {
    // Vérifications multi-niveaux
    if (isCreatingFolder) {
      console.log('⚠️ Création de dossier déjà en cours');
      return null;
    }

    const currentTime = Date.now();
    if (currentTime - lastFolderCreationTime < CREATION_COOLDOWN) {
      console.log('⏳ Délai minimum non respecté:', currentTime - lastFolderCreationTime);
      return null;
    }

    // Verrouiller la création
    isCreatingFolder = true;

    console.log('📁 Tentative de création de dossier:', option);
    const user = await userModel.findOne({ email });

    if (!user) {
      isCreatingFolder = false;
      throw new Error(`Utilisateur avec l'email "${email}" non trouvé`);
    }

    const apiKeysMap = user.apiKeys as Map<string, string>;
    const dropboxToken = apiKeysMap.get('dropbox');

    if (!dropboxToken) {
      isCreatingFolder = false;
      throw new Error('Token Dropbox manquant');
    }

    // Vérifier si le dossier existe déjà
    const listResponse = await axios.post(
      'https://api.dropboxapi.com/2/files/list_folder',
      {
        path: '',
        recursive: false
      },
      {
        headers: {
          Authorization: `Bearer ${dropboxToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const existingFolders = listResponse.data.entries
      .filter((entry: any) => entry['.tag'] === 'folder')
      .map((folder: any) => folder.name);

    if (existingFolders.includes(option)) {
      console.log('🚫 Un dossier avec ce nom existe déjà:', option);
      isCreatingFolder = false;
      return null;
    }

    const folderPath = `/${option}`;

    // Créer le dossier
    await axios.post(
      'https://api.dropboxapi.com/2/files/create_folder_v2',
      {
        path: folderPath,
        autorename: false
      },
      {
        headers: {
          Authorization: `Bearer ${dropboxToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Mettre à jour les variables de contrôle
    createdFolders.add(option);
    lastFolderCreationTime = currentTime;
    isCreatingFolder = false;

    console.log('✅ Dossier créé avec succès:', folderPath);
    return {
      message: `📁 Nouveau dossier Dropbox créé !\nNom: ${option}\nChemin: ${folderPath}`
    };

  } catch (error) {
    isCreatingFolder = false;
    console.error('❌ Erreur dans createFolder_dropbox:', error);
    if (axios.isAxiosError(error)) {
      console.error("Détails de l'erreur:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    throw error;
  }
};