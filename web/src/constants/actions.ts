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
  }

];

export const availableReactions: Action[] = [
  {
    id: 'sendMessage_telegram',
    service: 'telegram',
    type: 'sendMessage',
    description: 'Send a message on Telegram',
  },
  {
    id: 'sendMessage_discord',
    service: 'discord',
    type: 'sendMessage',
    description: 'Send a message on Discord',
  }
];