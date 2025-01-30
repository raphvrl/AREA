import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface TelegramMessage {
  message: string;
}

export const sendMessage_telegram = async (
  email: String,
  actionResult: TelegramMessage | null
): Promise<boolean> => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Missing Telegram configuration');
    }

    if (!actionResult || !actionResult.message) {
      console.log('Pas de message à envoyer');
      return true;
    }

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: actionResult.message,
        parse_mode: 'HTML',
      }
    );

    console.log('Telegram API response:', response.data);
    console.log('Message sent for user:', email);
    return response.data.ok;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in sendMessage_telegram:', error.message);
      throw new Error(error.message);
    } else {
      console.error('An unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
};
