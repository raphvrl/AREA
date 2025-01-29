import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface ActionResult {
    message?: string;
    imageUrl?: string;
    name?: string;  // Ajout de la propriété name
}

interface ActionResult {
    name?: string;
    html_url?: string;  // Ajout de l'URL du repo
}

export const sendMessage_telegram = async (email: String, actionResult: ActionResult | null): Promise<boolean> => {
    const user_email = email;
    try {
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            throw new Error('Missing Telegram configuration');
        }

        // Si actionResult est null, ne rien faire
        if (!actionResult) {
            console.log('Pas de nouveau repository, aucun message envoyé');
            return true;
        }

        // Construire le message avec le nom du repo et son URL
        const message = `🎉 Nouveau repository GitHub créé:\nNom: ${actionResult.name}\nURL: ${actionResult.html_url}`;

        // Envoyer un message texte simple
        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            }
        );

        console.log('Telegram API response:', response.data);
        console.log('Message sent for user:', user_email);
        return response.data.ok;

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
