// src/constants/actions.ts
import { Action } from '../types/area';

export const availableActions: Action[] = [
  {
    id: 'repoCreatedGithub',
    service: 'github',
    type: 'repoCreated',
    description: 'When a new repository is created on Github',
  },
  {
    id: 'checkNewSongSpotify',
    service: 'spotify',
    type: 'checkNewSong',
    description: 'When a song is played',
  },
];

export const availableReactions: Action[] = [
  {
    id: 'sendMessageTelegram',
    service: 'telegram',
    type: 'sendMessage',
    description: 'Send a message on Telegram',
  },
  {
    id: 'sendMessageDiscord',
    service: 'discord',
    type: 'sendMessage',
    description: 'Send a message on Discord',
  },
];
