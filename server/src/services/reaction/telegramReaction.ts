import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface TelegramMessage {
  message: string;
}

export const sendMessageTelegram = async (
  email: String,
  option: string,
  actionResult: TelegramMessage | null
): Promise<boolean> => {
  try {
    const parts = option.split('_');

    const telegramBot = parts[0];
    const chatId = parts[1];
    if (!telegramBot || !chatId) {
      throw new Error('Missing Telegram configuration');
    }

    if (!actionResult || !actionResult.message) {
      console.log('Pas de message à envoyer');
      return true;
    }

    const response = await axios.post(
      `https://api.telegram.org/bot${telegramBot}/sendMessage`,
      {
        chat_id: chatId,
        text: actionResult.message,
        parse_mode: 'HTML',
      }
    );

    console.log('Telegram API response:', response.data);
    console.log('Message sent for user:', email);
    return response.data.ok;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in sendMessageTelegram:', error.message);
      throw new Error(error.message);
    } else {
      console.error('An unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
};
