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
    description: 'When a song is played'
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