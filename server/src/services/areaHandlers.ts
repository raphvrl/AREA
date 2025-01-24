import { time10_seconde, sendmessage_terminal } from './fonction'; // Import des fonctions

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
};

export default areaHandlers;
