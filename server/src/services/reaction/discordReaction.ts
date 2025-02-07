import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

interface DiscordMessage {
  message: string;
}

export const sendMessageDiscord = async (
  email: String,
  option: String,
  actionResult: DiscordMessage | null
): Promise<boolean> => {
  try {
    if (!option) {
      throw new Error('Missing Discord webhook URL configuration');
    }

    if (!actionResult || !actionResult.message) {
      console.log('Pas de message à envoyer');
      return true;
    }

    const response = await axios.post(option as string, {
      content: actionResult.message,
      username: 'AREA Bot',
      avatar_url: 'https://github.com/github.png',
    });

    console.log('Discord webhook response status:', response.status);
    console.log('Message sent for user:', email);
    return response.status === 204;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in sendMessageDiscord:', error.message);
      throw new Error(error.message);
    } else {
      console.error('An unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
};
