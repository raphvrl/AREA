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
import { sendMessageTeams } from './reaction/teamsReaction';
import { twitchFollowChange } from './action/twitchFollowChange';
import { sendGifDiscord } from './reaction/giphyReaction';
import { createFolder_dropbox } from './reaction/dropboxCreateReaction';
import { createPlaylist_spotify } from './reaction/spotifyReaction';
import { playTrack_spotify } from './reaction/playTrackReaction';
import { createRepo_github } from './reaction/githubCreateReaction';

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
    option?: string,
    actionResult?: any
  ) => {
    const result = await sendMessageTelegram(
      email,
      option as string,
      actionResult
    );
    return result;
  },
  sendMessage_discord: async (
    email: string,
    option?: string,
    actionResult?: any
  ) => {
    const result = await sendMessageDiscord(
      email,
      option as string,
      actionResult
    );
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
  sendMessage_teams: async (
    email: String,
    option?: string,
    actionResult?: any
  ) => {
    const result = await sendMessageTeams(
      email,
      option as string,
      actionResult
    );
    return result;
  },
  createFolder_dropbox: async (
    email: string,
    option?: string,
    actionResult?: any
  ) => {
    const result = await createFolder_dropbox(
      email,
      option as string,
      actionResult
    );
    return result;
  },
  sendGif_discord: async (
    email: string,
    option?: string,
    actionResult?: any
  ) => {
    const result = await sendGifDiscord(email, option as string, actionResult);
    return result;
  },
  createPlaylist_spotify: async (
    email: string,
    option?: string,
    actionResult?: any
  ) => {
    const result = await createPlaylist_spotify(
      email,
      option as string,
      actionResult
    );
    return result;
  },
  followlist_twitch: async (email: string) => {
    const result = await twitchFollowChange(email);
    return result;
  },
  playTrack_spotify: async (
    email: string,
    option?: string,
    actionResult?: any
  ) => {
    const result = await playTrack_spotify(email, option as string, actionResult);
    return result;
  },
  createRepo_github: async (
    email: string,
    option?: string,
    actionResult?: any
  ) => {
    const result = await createRepo_github(email, option as string, actionResult);
    return result;
  }

};

export default areaHandlers;
