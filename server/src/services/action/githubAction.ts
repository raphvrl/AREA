import axios from 'axios';
import UserModel from '../../db/UserModel';

interface GithubRepo {
    id: number;
    name: string;
    html_url: string;
    created_at: string;
    message?: string;
}

let lastKnownRepoId = 0;
let isInitialized = false;

export const repoCreated_github = async (email: string): Promise<GithubRepo | null> => {
    try {
        const serviceKey = 'github';
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        const apiKeysMap = user.apiKeys as Map<string, string>;
        const githubToken = apiKeysMap.get(serviceKey);
        if (!githubToken) {
            throw new Error('GitHub token not found');
        }

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
        
        if (!isInitialized) {
            lastKnownRepoId = latestRepo.id;
            isInitialized = true;
            console.log('Initialisation: sauvegarde du dernier repo');
            return null;
        }

        if (latestRepo && latestRepo.id > lastKnownRepoId) {
            lastKnownRepoId = latestRepo.id;
            console.log('Nouveau repository détecté:', {
                name: latestRepo.name,
                id: latestRepo.id,
                created_at: latestRepo.created_at
            });

            latestRepo.message = `🎉 Nouveau repository GitHub créé:\nNom: ${latestRepo.name}\nURL: ${latestRepo.html_url}`;
            return latestRepo;
        }

        return null;

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