import { time10Seconde, sendmessageTerminal } from './fonction';
import { repoCreatedGithub } from './action/githubAction';
import { sendMessageTelegram } from './reaction/telegramReaction';
import { checkNewSongSpotify } from './action/checkNewSongSpotify';
import { sendMessageDiscord } from './reaction/discordReaction';
import {checkLinkedInConnections} from './action/checkLinkedInConnections';
import {createLinkedInPost} from './reaction/createLinkedInPost'
type Handler = (email: any, data?: any) => Promise<any>;

const areaHandlers: { [key: string]: Handler } = {
  time10_seconde: async () => {
    const result = await time10Seconde();
    console.log('Timer terminÃ© :', result);
    return result;
  },
  sendmessage_terminal: async () => {
    await sendmessageTerminal();
    return 'Message sent to terminal';
  },
  repoCreated_github: async (email?: string) => {
    if (!email) {
      throw new Error('Email est requis.');
    }
    const result = await repoCreatedGithub(email);
    return result;
  },
  checkNewSong_spotify: async (email?: string) => {
    if (!email) {
      throw new Error('Email est requis.');
    }
    const result = await checkNewSongSpotify(email);
    return result;
  },
  sendMessage_telegram: async (email: String, actionResult?: any) => {
    const result = await sendMessageTelegram(email, actionResult);
    return result;
  },
  creatPost_linkedin: async (email?: string, actionResult?: any) => {
    if (!email) {
      throw new Error('Email est requis.');
    }
    const result = await createLinkedInPost(email, actionResult);
    return result;
  },
  sendMessage_discord: async (email: String, actionResult?: any) => {
    const result = await sendMessageDiscord(email, actionResult);
    return result;
  },
};

export default areaHandlers;
