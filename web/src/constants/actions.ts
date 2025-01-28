// src/constants/actions.ts
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
    description: 'When a song is added to the favorite playlist'
  }
];

export const availableReactions: Action[] = [
  {
    id: 'spotify-play',
    service: 'Spotify',
    type: 'PLAY_TRACK',
    description: 'Play a track on Spotify',
    config: {
      timer: 30
    }
  },
  {
    id: 'sendMessage_telegram',
    service: 'telegram',
    type: 'sendMessage',
    description: 'Send a message on Telegram',
  },
  {
    id: 'spotify-save',
    service: 'Spotify', 
    type: 'SAVE_TRACK',
    description: 'Save current track to Spotify favorites'
  }
];