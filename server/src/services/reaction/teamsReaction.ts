// teamsReaction.ts
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TEAMS_WEBHOOK_URL = process.env.TEAMS_WEBHOOK_URL;

interface TeamsMessage {
  message: string;
}

export const sendMessageTeams = async (
  email: String,
  actionResult: TeamsMessage | null
): Promise<boolean> => {
  try {
    if (!TEAMS_WEBHOOK_URL) {
      throw new Error('Missing Teams webhook URL configuration');
    }

    if (!actionResult || !actionResult.message) {
      console.log('Pas de message à envoyer');
      return true;
    }

    const response = await axios.post(TEAMS_WEBHOOK_URL, {
      text: actionResult.message,

    });

    console.log('Teams webhook response status:', response.status);
    console.log('Message sent for user:', email);
    return response.status === 200;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in sendMessageTeams:', error.message);
      throw new Error(error.message);
    } else {
      console.error('An unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
};