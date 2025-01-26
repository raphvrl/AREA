import { time10_seconde, sendmessage_terminal } from './fonction';
import { nomAction_nomSerice } from './action/testFonction';

const areaHandlers: { [key: string]: (input?: any) => Promise<any> } = {
    time10_seconde: async () => {
        const result = await time10_seconde();
        console.log("Timer terminé :", result);
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
};

export default areaHandlers;
