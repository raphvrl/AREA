import axios from 'axios';
import UserModel from '../../db/userModel';

interface GithubFollower {
    id: number;
    login: string;
    html_url: string;
    avatar_url: string;
    message?: string;
}

let knownFollowers: Set<number> = new Set();
let isInitialized = false;

export const followerAdded_github = async (email: string): Promise<GithubFollower | null> => {
    try {
        console.log('✨ Vérification des nouveaux followers GitHub pour:', email);
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        const apiKeysMap = user.apiKeys as Map<string, string>;
        const githubToken = apiKeysMap.get('github');

        if (!githubToken) {
            throw new Error(`GitHub token missing for user "${email}".`);
        }

        console.log('🔍 Requête API GitHub en cours...');
        // Modification des headers pour inclure le token correctement
        const response = await axios.get('https://api.github.com/user/followers', {
            headers: {
                'Authorization': `token ${githubToken}`, // Changement ici: 'token' au lieu de 'Bearer'
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'AREA-App' // Ajout du User-Agent requis par GitHub
            }
        });

        const currentFollowers = response.data;
        console.log('📊 Statistiques actuelles:', {
            totalFollowers: currentFollowers.length,
            knownFollowersCount: knownFollowers.size,
            isFirstRun: !isInitialized
        });

        // Log des 5 derniers followers
        console.log('👥 5 derniers followers:');
        currentFollowers.slice(0, 5).forEach((follower: GithubFollower, index: number) => {
            console.log(`${index + 1}. Login: ${follower.login}, ID: ${follower.id}`);
        });

        if (!isInitialized) {
            currentFollowers.forEach((follower: GithubFollower) => {
                knownFollowers.add(follower.id);
            });
            isInitialized = true;
            console.log('🚀 Première exécution - Initialisation avec:', {
                followersCount: knownFollowers.size,
                followersList: Array.from(knownFollowers).slice(0, 3) // Affiche les 3 premiers IDs
            });
            return null;
        }

        // Chercher les nouveaux followers
        console.log('🔄 Comparaison des followers...');
        for (const follower of currentFollowers) {
            if (!knownFollowers.has(follower.id)) {
                knownFollowers.add(follower.id);
                console.log('✅ Nouveau follower détecté !', {
                    login: follower.login,
                    id: follower.id,
                    profileUrl: follower.html_url,
                    totalFollowersNow: knownFollowers.size
                });

                return {
                    ...follower,
                    message: `👥 Nouvel abonné sur GitHub !\nUtilisateur: ${follower.login}\nProfil: ${follower.html_url}`
                };
            }
        }

        console.log('😴 Aucun nouveau follower détecté');
        return null;

    } catch (error) {
        console.error('❌ Erreur dans followerAdded_github:', {
            type: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : 'Erreur inconnue',
            stack: error instanceof Error ? error.stack : undefined
        });
        
        if (error instanceof Error) {
            throw new Error(`Erreur lors de la vérification des followers: ${error.message}`);
        } else {
            throw new Error('Une erreur inconnue est survenue');
        }
    }
};