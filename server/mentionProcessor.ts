import axios, { AxiosError } from 'axios';
import User from './UserModel';
import dotenv from 'dotenv';

dotenv.config();

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
if (!BEARER_TOKEN) {
  throw new Error('Missing Twitter Bearer Token in environment variables');
}

// Fonction pour introduire un délai
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fonction principale
export const processMentionsAndLikes = async () => {
  console.log('Démarrage du traitement des mentions et des likes...');
  try {
    // Étape 1 : Récupérer les utilisateurs avec `service.X = true`
    const users = await User.find({ 'service.X': true });

    if (!users.length) {
      console.log('Aucun utilisateur avec le service X activé.');
      return;
    }

    for (const user of users) {
        let apiKey: string = "";
        let id_service: string = "";
      if (user.apiKeys instanceof Map && user.idService instanceof Map) {
        apiKey = user.apiKeys.get('X');
        id_service = user.idService.get('X');
      }
      if (!apiKey) {
        console.warn(`Utilisateur ${user.email} n'a pas de clé API X.`);
        continue;
      }

      // Étape 2 : Appeler l'API X pour récupérer les mentions
      console.log(`Recherche des mentions pour l'utilisateur : ${user.email}`);
      
      try {
        const mentionsResponse = await axios.get(
          `https://api.x.com/2/users/${id_service}/mentions`,
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );

        const mentions = mentionsResponse.data.data || [];
        console.log(`Mentions trouvées pour ${user.email} :`, mentions);

        // Étape 3 : Liker les tweets mentionnés
        for (const mention of mentions) {
          const tweetId = mention.id;

          try {
            console.log(`Tentative de like pour le tweet ID : ${tweetId}`);
            const likeResponse = await axios.post(
              `https://api.x.com/2/users/${id_service}/likes`,
              { tweet_id: tweetId },
              {
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            console.log(`Tweet ${tweetId} aimé avec succès pour ${user.email}.`);
          } catch (likeError: unknown) {
            handleAxiosError(likeError, `Erreur lors du like pour le tweet ID ${tweetId}`);
          }
        }
      } catch (mentionError: unknown) {
        handleAxiosError(mentionError, `Erreur lors de la récupération des mentions pour ${user.email}`);
      }

      // Étape 4 : Pause de 15 minutes avant de traiter le prochain utilisateur
      console.log(`Pause de 15 minutes avant le traitement suivant...`);
      await delay(15 * 60 * 1000);
    }
  } catch (error: unknown) {
    handleGenericError(error, 'Erreur lors du traitement des mentions et des likes');
  }
};

// Gestion des erreurs Axios
const handleAxiosError = (error: unknown, context: string) => {
  if (axios.isAxiosError(error)) {
    console.error(`${context} - Axios error:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  } else {
    handleGenericError(error, context);
  }
};

// Gestion des erreurs génériques
const handleGenericError = (error: unknown, context: string) => {
  if (error instanceof Error) {
    console.error(`${context} - Error:`, error.message);
  } else {
    console.error(`${context} - Unknown error:`, error);
  }
};
