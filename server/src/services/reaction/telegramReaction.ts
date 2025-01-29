import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface ActionResult {
  message?: string;
  imageUrl?: string;
}

export const sendMessage_telegram = async (
  email: String,
  actionResult: ActionResult
): Promise<boolean> => {
  const user_email = email;
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Missing Telegram configuration');
    }

    const message = actionResult.message || 'Nouvelle action déclenchée';
    const imageUrl = actionResult.imageUrl;

    if (!imageUrl) {
      // Envoyer un message texte simple
      const response = await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }
      );

      console.log('Telegram API response:', response.data);
      return response.data.ok;
    } else {
      // Envoyer une image avec légende
      const response = await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          photo: imageUrl,
          caption: message,
        }
      );

      console.log('Telegram API response:', response.data);
      console.log(user_email);
      return response.data.ok;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in sendMessage_telegram:', error.message);
      throw new Error(error.message);
    } else {
      console.error('An unknown error occurred in sendMessage_telegram');
      throw new Error('An unknown error occurred');
    }
  }
};
