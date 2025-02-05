import axios from 'axios';
import userModel from '../../db/userModel';

interface GithubResponse {
  message: string;
  repoUrl?: string;
}

export const createRepo_github = async (
  email: string,
  option: string,
  actionResult?: any
): Promise<GithubResponse | null> => {
  try {
    console.log('🔨 Tentative de création de repository GitHub:', option);
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error(`Utilisateur avec l'email "${email}" non trouvé`);
    }

    const apiKeysMap = user.apiKeys as Map<string, string>;
    const githubToken = apiKeysMap.get('github');

    if (!githubToken) {
      throw new Error('Token GitHub manquant');
    }

    const response = await axios.post(
      'https://api.github.com/user/repos',
      {
        name: option,
        private: false,
        description: 'Repository créé via AREA'
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    console.log('✅ Repository créé avec succès:', response.data.html_url);
    return {
      message: `📦 Nouveau repository GitHub créé!\nNom: ${option}\nURL: ${response.data.html_url}`,
      repoUrl: response.data.html_url
    };

  } catch (error) {
    console.error('❌ Erreur dans createRepo_github:', error);
    throw error;
  }
};