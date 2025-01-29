import axios from 'axios';
import UserModel from '../../db/UserModel';

interface GithubRepo {
  id: number;
  name: string;
  created_at: string;
}

// Variable pour stocker le dernier ID de repo connu
let lastKnownRepoId = 0;

export const repoCreated_github = async (email: string): Promise<GithubRepo | null> => {
    try {
        const serviceKey = 'github';
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        // Récupérer le token GitHub
        const apiKeysMap = user.apiKeys as Map<string, string>;
        const githubToken = apiKeysMap.get(serviceKey);
        if (!githubToken) {
            throw new Error('GitHub token not found');
        }

        // Faire une requête à l'API GitHub pour obtenir les repos
        const response = await axios.get('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            params: {
                sort: 'created',
                direction: 'desc',
                per_page: 1
            }
        });

        const latestRepo = response.data[0] as GithubRepo;
        
        // Vérifier si c'est un nouveau repo
        if (latestRepo && latestRepo.id > lastKnownRepoId) {
            lastKnownRepoId = latestRepo.id;
            console.log('Nouveau repository détecté:', {
                name: latestRepo.name,
                id: latestRepo.id,
                created_at: latestRepo.created_at
            });
            return latestRepo;
        }

        return null; // Aucun nouveau repo détecté

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in githubRepoCreated:', error.message);
            throw new Error(error.message);
        } else {
            console.error('An unknown error occurred');
            throw new Error('An unknown error occurred');
        }
    }
};
