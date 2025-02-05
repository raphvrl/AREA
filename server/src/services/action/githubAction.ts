import axios from 'axios';
import userModel from '../../db/userModel';

interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  created_at: string;
  message?: string;
}

let lastKnownRepoId = 0;
let isInitialized = false;

export const repoCreatedGithub = async (
  email: string
): Promise<GithubRepo | null> => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error(`User with email "${email}" not found.`);
    }

    const apiKeysMap = user.apiKeys as Map<string, string>;
    const githubToken = apiKeysMap.get('github');
    
    if (!githubToken) {
      console.log('⚠️ Token GitHub manquant pour:', email);
      return null;
    }

    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AREA-App'
      },
      params: {
        sort: 'created',
        direction: 'desc',
        per_page: 1
      }
    });

    const latestRepo = response.data[0] as GithubRepo;

    if (!isInitialized) {
      if (latestRepo) {
        lastKnownRepoId = latestRepo.id;
        isInitialized = true;
        console.log('🚀 Première exécution - Initialisation avec le repo:', {
          name: latestRepo.name,
          id: latestRepo.id
        });
      }
      return null;
    }

    if (latestRepo && latestRepo.id > lastKnownRepoId) {
      lastKnownRepoId = latestRepo.id;
      console.log('✨ Nouveau repository détecté:', {
        name: latestRepo.name,
        id: latestRepo.id,
        created_at: latestRepo.created_at
      });

      return {
        ...latestRepo,
        message: `🎉 Nouveau repository GitHub créé:\nNom: ${latestRepo.name}\nURL: ${latestRepo.html_url}`
      };
    }

    console.log('😴 Aucun nouveau repository détecté');
    return null;

  } catch (error) {
    console.error('❌ Erreur dans repoCreatedGithub:', error);
    if (axios.isAxiosError(error)) {
      console.error('Détails de l\'erreur:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    
    if (error instanceof Error) {
      throw new Error(`Erreur lors de la vérification des repositories: ${error.message}`);
    }
    throw new Error('Une erreur inconnue est survenue');
  }
};