import { time10Seconde, sendmessageTerminal } from './fonction';
import { repoCreatedGithub } from './action/githubAction';
import { sendMessageTelegram } from './reaction/telegramReaction';
import { checkNewSongSpotify } from './action/checkNewSongSpotify';
import { sendMessageDiscord } from './reaction/discordReaction';
import { playlistCreated_spotify } from './action/playlistCreatedSpotify';
import { fileUploaded_dropbox } from './action/fileUploaded_dropbox';
import { folderCreated_dropbox } from './action/folderCreated_dropbox';
import { fileDeleted_dropbox } from './action/fileDeleted_dropbox';
import { trackLiked_spotify } from './action/trackLiked_spotify';
import { repoStarred_github } from './action/repoStarred_github';
import { followerAdded_github } from './action/followerAdded_github';
import { pageCreated_notion } from './action/pageCreated_notion';
import { createLinkedInPost } from './reaction/createLinkedInPost';

type Handler = (email: string, option?: string, data?: any) => Promise<any>;

const areaHandlers: { [key: string]: Handler } = {
  time10_seconde: async (email: string, option?: string) => {
    const result = await time10Seconde(email, option);
    console.log('Timer terminé :', result);
    return result;
  },
  sendmessage_terminal: async (
    email: string,
    data?: string,
    option?: string
  ) => {
    await sendmessageTerminal(email, data, option);
    return 'Message sent to terminal';
  },
  repoCreated_github: async (email: string, option?: string) => {
    const result = await repoCreatedGithub(email);
    return result;
  },
  checkNewSong_spotify: async (email: string, option?: string) => {
    const result = await checkNewSongSpotify(email);
    return result;
  },
  sendMessage_telegram: async (
    email: string,
    actionResult?: any,
    option?: string
  ) => {
    const result = await sendMessageTelegram(email, actionResult);
    return result;
  },
  creatPost_linkedin: async (
    email: string,
    actionResult?: any,
    option?: string
  ) => {
    const result = await createLinkedInPost(email, actionResult);
    return result;
  },
  sendMessage_discord: async (
    email: string,
    actionResult?: any,
    option?: string
  ) => {
    const result = await sendMessageDiscord(email, actionResult);
    return result;
  },
  playlistCreated_spotify: async (email: string, option?: string) => {
    const result = await playlistCreated_spotify(email);
    return result;
  },
  fileUploaded_dropbox: async (email: string, option?: string) => {
    const result = await fileUploaded_dropbox(email);
    return result;
  },
  folderCreated_dropbox: async (email: string, option?: string) => {
    const result = await folderCreated_dropbox(email);
    return result;
  },
  fileDeleted_dropbox: async (email: string, option?: string) => {
    const result = await fileDeleted_dropbox(email);
    return result;
  },
  trackLiked_spotify: async (email: string, option?: string) => {
    const result = await trackLiked_spotify(email);
    return result;
  },
  repoStarred_github: async (email: string, option?: string) => {
    const result = await repoStarred_github(email);
    return result;
  },
  followerAdded_github: async (email: string, option?: string) => {
    const result = await followerAdded_github(email);
    return result;
  },
  pageCreated_notion: async (email: string, option?: string) => {
    const result = await pageCreated_notion(email);
    return result;
  },
};

export default areaHandlers;
