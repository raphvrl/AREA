import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface DiscordResponse {
  message: string;
}

export const sendGifDiscord = async (
  email: string,
  option: String,
  actionResult?: any
): Promise<DiscordResponse | null> => {
  try {
    console.log("🎮 Tentative d'envoi de GIF sur Discord");

    // Récupérer un GIF aléatoire via GIPHY
    const giphyResponse = await axios.get(
      `https://api.giphy.com/v1/gifs/random`,
      {
        params: {
          api_key: process.env.GIPHY_API_KEY,
          rating: 'g', // GIFs adaptés à tous publics
        },
      }
    );

    const gifUrl = giphyResponse.data.data.images.original.url;

    // Envoyer le GIF sur Discord via webhook
    await axios.post(option as string, {
      content: gifUrl,
    });

    console.log('✅ GIF envoyé avec succès sur Discord');
    return {
      message: '🎮 GIF envoyé sur Discord!',
    };
  } catch (error) {
    console.error('❌ Erreur dans sendGifDiscord:', error);
    if (axios.isAxiosError(error)) {
      console.error("Détails de l'erreur:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }
    throw new Error(
      `Erreur lors de l'envoi du GIF: ${
        error instanceof Error ? error.message : 'Erreur inconnue'
      }`
    );
  }
};
