import axios from 'axios';
import userModel from '../../db/userModel';

interface TwitchFollow {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  followed_at: string;
}

let knownFollows: Set<string> = new Set();
let isInitialized = false;

export const twitchFollowChange = async (email: string): Promise<{message: string} | null> => {
  try {
    console.log('🔍 Vérification des chaînes suivies Twitch pour:', email);
    const user = await userModel.findOne({ email });
    
    if (!user) {
      throw new Error(`Utilisateur avec l'email "${email}" non trouvé`);
    }

    const apiKeysMap = user.apiKeys as Map<string, string>;
    const idServiceMap = user.idService as Map<string, string>;
    const twitchToken = apiKeysMap.get('twitch');
    const twitchUserId = idServiceMap.get('twitch');

    console.log('🔑 Informations utilisateur:', {
      userId: twitchUserId,
      hasToken: !!twitchToken
    });

    if (!twitchToken || !twitchUserId) {
      throw new Error('Informations d\'authentification Twitch manquantes');
    }

    // Utiliser le nouvel endpoint de l'API Twitch
    const response = await axios.get(
      `https://api.twitch.tv/helix/channels/followed?user_id=${twitchUserId}`,
      {
        headers: {
          'Authorization': `Bearer ${twitchToken}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID as string
        }
      }
    );

    const currentFollows = response.data.data as TwitchFollow[];
    console.log('📊 Données des chaînes suivies:', {
      totalFollows: response.data.total,
      dataLength: currentFollows.length
    });

    // Log des 5 dernières chaînes suivies
    console.log('📺 Liste des 5 dernières chaînes suivies:');
    currentFollows.slice(0, 5).forEach((follow: TwitchFollow, index: number) => {
      console.log(`${index + 1}. ${follow.broadcaster_name} (ID: ${follow.broadcaster_id})`);
    });

    const currentFollowIds = new Set(currentFollows.map(follow => follow.broadcaster_id));

    if (!isInitialized) {
      knownFollows = currentFollowIds;
      isInitialized = true;
      console.log('🚀 Première exécution - Initialisation avec', knownFollows.size, 'chaînes suivies');
      return null;
    }

    // Vérifier les nouvelles chaînes suivies
    const newFollows = Array.from(currentFollowIds).filter(id => !knownFollows.has(id));
    if (newFollows.length > 0) {
      const newFollow = currentFollows.find(follow => follow.broadcaster_id === newFollows[0]);
      console.log('✅ Nouvelle chaîne suivie:', newFollow?.broadcaster_name);
      knownFollows = currentFollowIds;
      return {
        message: `📺 Vous suivez maintenant la chaîne ${newFollow?.broadcaster_name} sur Twitch!`
      };
    }

    // Vérifier les unfollows
    const unfollows = Array.from(knownFollows).filter(id => !currentFollowIds.has(id));
    if (unfollows.length > 0) {
      knownFollows = currentFollowIds;
      return {
        message: `📺 Vous ne suivez plus une chaîne sur Twitch`
      };
    }

    console.log('😴 Aucun changement dans les chaînes suivies');
    return null;

  } catch (error) {
    console.error('❌ Erreur dans twitchFollowChange:', error);
    if (axios.isAxiosError(error)) {
      console.error('Détails de l\'erreur:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    throw new Error(
      `Erreur lors de la vérification des chaînes suivies: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    );
  }
};