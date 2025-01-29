import { time10_seconde, sendmessage_terminal } from './fonction';
import { nomAction_nomSerice } from './action/testFonction';
import { repoCreated_github } from './action/githubAction';
import { sendMessage_telegram } from './reaction/telegramReaction';
import { checkNewSong_spotify } from './action/checkNewSongSpotify'
type Handler = (email: any, data?: any) => Promise<any>;

const areaHandlers: { [key: string]: Handler } = {
    time10_seconde: async () => {
        const result = await time10_seconde();
        console.log("Timer terminÃ© :", result);
        return result;
    },
    sendmessage_terminal: async () => {
        await sendmessage_terminal();
        return "Message sent to terminal";
    },
    nomAction_nomSerice: async (email?: string) => {
        if (!email) {
            throw new Error('Email est requis.');
        }
        const result = await nomAction_nomSerice(email);
        return result;
    },
    repoCreated_github: async (email?: string) => {
        if (!email) {
            throw new Error('Email est requis.');
        }
        const result = await repoCreated_github(email);
        return result;
    },
    sendMessage_telegram: async (email: String, actionResult?: any) => {
        const result = await sendMessage_telegram(email, actionResult);
        return result;
    },
    checkNewSong_spotify: async (email?: string,) => {
        if (!email) {
            throw new Error('Email est requis.');
        }
        const result = await checkNewSong_spotify(email);
        return result;
    }
};

export default areaHandlers;