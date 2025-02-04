import axios from 'axios';
import userModel from '../../db/userModel';

interface DropboxResponse {
  message: string;
}

export const createFolder_dropbox = async (
  email: string,
  option: String,
  actionResult?: any
): Promise<DropboxResponse | null> => {
  try {
    console.log('📁 Tentative de création de dossier Dropbox pour:', email);
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error(`Utilisateur avec l'email "${email}" non trouvé`);
    }

    const apiKeysMap = user.apiKeys as Map<string, string>;
    const dropboxToken = apiKeysMap.get('dropbox');

    if (!dropboxToken) {
      throw new Error('Token Dropbox manquant');
    }

    // Nom du dossier à créer (en dur pour l'instant)
    const folderName = option;
    const folderPath = `/${folderName}`;

    // Créer le dossier
    await axios.post(
      'https://api.dropboxapi.com/2/files/create_folder_v2',
      {
        path: folderPath,
        autorename: true,
      },
      {
        headers: {
          Authorization: `Bearer ${dropboxToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Dossier créé avec succès:', folderPath);
    return {
      message: `📁 Nouveau dossier Dropbox créé !\nNom: ${folderName}\nChemin: ${folderPath}`,
    };
  } catch (error) {
    console.error('❌ Erreur dans createFolder_dropbox:', error);
    if (axios.isAxiosError(error)) {
      console.error("Détails de l'erreur:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }
    throw new Error(
      `Erreur lors de la création du dossier: ${
        error instanceof Error ? error.message : 'Erreur inconnue'
      }`
    );
  }
};
