// src/constants/actions.ts
import { Action } from '../types/area';

export const availableActions: Action[] = [
  {
    id: 'spotify-track-playing',
    service: 'Spotify',
    type: 'TRACK_PLAYING',
    description: 'When a track starts playing on Spotify',
  },
  {
    id: 'spotify-auth',
    service: 'Spotify',
    type: 'AUTH_STATUS',
    description: 'When Spotify authentication status changes',
  },
  {
    id: 'repoCreated_github',
    service: 'github',
    type: 'repoCreated',
    description: 'When a new repository is created on Github',
  },
  {
    id: 'user-login',
    service: 'Auth',
    type: 'LOGIN',
    description: 'When user logs in',
  },
];

export const availableReactions: Action[] = [
  {
    id: 'spotify-play',
    service: 'Spotify',
    type: 'PLAY_TRACK',
    description: 'Play a track on Spotify',
    config: {
      timer: 30,
    },
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
    description: 'Save current track to Spotify favorites',
  },
];
