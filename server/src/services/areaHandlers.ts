import { time10Seconde, sendmessageTerminal } from './fonction';
import { repoCreatedGithub } from './action/githubAction';
import { sendMessageTelegram } from './reaction/telegramReaction';
import { checkNewSongSpotify } from './action/checkNewSongSpotify';
import { sendMessageDiscord } from './reaction/discordReaction';
type Handler = (email: any, data?: any) => Promise<any>;

const areaHandlers: { [key: string]: Handler } = {
  time10Seconde: async () => {
    const result = await time10Seconde();
    console.log('Timer terminÃ© :', result);
    return result;
  },
  sendmessageTerminal: async () => {
    await sendmessageTerminal();
    return 'Message sent to terminal';
  },
  repoCreatedGithub: async (email?: string) => {
    if (!email) {
      throw new Error('Email est requis.');
    }
    const result = await repoCreatedGithub(email);
    return result;
  },
  sendMessageTelegram: async (email: String, actionResult?: any) => {
    const result = await sendMessageTelegram(email, actionResult);
    return result;
  },
  checkNewSongSpotify: async (email?: string) => {
    if (!email) {
      throw new Error('Email est requis.');
    }
    const result = await checkNewSongSpotify(email);
    return result;
  },
  sendMessageDiscord: async (email: String, actionResult?: any) => {
    const result = await sendMessageDiscord(email, actionResult);
    return result;
  },
};

export default areaHandlers;
