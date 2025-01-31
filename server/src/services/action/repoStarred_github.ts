import axios from 'axios';
import UserModel from '../../db/userModel';

interface GithubStar {
    stargazers_count: number;
    name: string;
    html_url: string;
    message?: string;
}

let lastStarCount: Map<string, number> = new Map();
let isInitialized = false;

export const repoStarred_github = async (email: string): Promise<GithubStar | null> => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        const apiKeysMap = user.apiKeys as Map<string, string>;
        const githubToken = apiKeysMap.get('github');

        if (!githubToken) {
            throw new Error(`GitHub token missing for user "${email}".`);
        }

        // Récupérer les repos de l'utilisateur
        const response = await axios.get('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        const repos = response.data;
        
        if (!isInitialized) {
            // Première exécution : sauvegarder le nombre d'étoiles pour chaque repo
            repos.forEach((repo: GithubStar) => {
                lastStarCount.set(repo.name, repo.stargazers_count);
            });
            isInitialized = true;
            console.log('Initialisation: sauvegarde du nombre d\'étoiles');
            return null;
        }

        // Vérifier chaque repo pour voir s'il y a de nouvelles étoiles
        for (const repo of repos) {
            const previousCount = lastStarCount.get(repo.name) || 0;
            
            if (repo.stargazers_count > previousCount) {
                lastStarCount.set(repo.name, repo.stargazers_count);
                console.log('Nouvelle étoile détectée:', {
                    name: repo.name,
                    previousStars: previousCount,
                    newStars: repo.stargazers_count
                });

                return {
                    ...repo,
                    message: `⭐ Nouvelle étoile sur GitHub !\nRepo: ${repo.name}\nTotal: ${repo.stargazers_count} étoiles\nURL: ${repo.html_url}`
                };
            }
        }

        return null;

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in repoStarred_github:', error.message);
            throw new Error(error.message);
        } else {
            throw new Error('Une erreur inconnue est survenue');
        }
    }
};