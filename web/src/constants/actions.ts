import { Action } from '../types/area';

export const availableActions: Action[] = [
  {
    id: 'repoCreated_github',
    service: 'github',
    type: 'repoCreated',
    description: 'When a new repository is created on Github'
  },
  {
    id: 'checkNewSong_spotify',
    service: 'spotify',
    type: 'checkNewSong',
    description: 'When a song is played'
  },
  {
    id: 'playlistCreated_spotify',
    service: 'spotify',
    type: 'playlistCreated',
    description: 'When a new playlist is created on Spotify'
  },
  {
    id: 'fileUploaded_dropbox',
    service: 'dropbox',
    type: 'fileUploaded',
    description: 'When a new file is uploaded to Dropbox'
  },
  {
    id: 'folderCreated_dropbox',
    service: 'dropbox',
    type: 'folderCreated',
    description: 'When a new folder is created in Dropbox'
  },
  {
    id: 'fileDeleted_dropbox',
    service: 'dropbox',
    type: 'fileDeleted',
    description: 'When a file is deleted from Dropbox'
  },
  {
    id: 'trackLiked_spotify',
    service: 'spotify',
    type: 'trackLiked',
    description: 'When a new track is liked on Spotify' 
  },
  {
    id: 'repoStarred_github',
    service: 'github',
    type: 'repoStarred',
    description: 'When a repository receives a new star'
  },
  {
    id: 'followerAdded_github',
    service: 'github',
    type: 'followerAdded',
    description: 'When you get a new GitHub follower'
  },
  {
    id: 'pageCreated_notion',
    service: 'notion',
    type: 'pageCreated',
    description: 'When you a new page is created in notion'
  },
  {
    id: 'twitchFollowChange',
    service: 'twitch',
    type: 'followlist',
    description: 'When your follow list changes on Twitch'
  }

];

export const availableReactions: Action[] = [
  {
    id: 'sendMessage_telegram',
    service: 'telegram',
    type: 'sendMessage',
    description: 'Send a message via Telegram',
    hasOptions: true // Supports option_reaction for custom message
  },
  {
    id: 'sendMessage_discord',
    service: 'discord', 
    type: 'sendMessage',
    description: 'Send a message via Discord',
    hasOptions: true // Supports option_reaction for custom message
  },
  {
    id: 'createFolder_dropbox',
    service: 'dropbox',
    type: 'createFolder',
    description: 'Create a new Dropbox folder',
    hasOptions: true // for name folder
  },
  {
    id: 'sendMessage_teams',
    service: 'teams',
    type: 'sendMessage',
    description: 'Send a message on Teams',
    hasOptions: true // for weebhook
  },
  {
    id: 'sendGif_discord',
    service: 'discord',
    type: 'sendGif',
    description: 'Send a random GIF on Discord',
    hasOptions: true // for weebhook
  },
  {
    id: 'createPlaylist_spotify',
    service: 'spotify',
    type: 'createPlaylist',
    description: 'Create a new Spotify playlist',
    hasOptions: true // for name playlist
  },
  {
    id: 'playTrack_spotify',
    service: 'spotify',
    type: 'playTrack',
    description: 'Lancer la lecture d\'une musique sur Spotify',
    hasOptions: true // Pour l'URL de la musique
  },
  {
    id: 'createRepo_github',
    service: 'github',
    type: 'createRepo',
    description: 'Créer un nouveau repository GitHub',
    hasOptions: true // Pour le nom du repository
  }
];