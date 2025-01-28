import { Action } from '../types/area';

export const availableActions: Action[] = [
  {
    id: 'test-timer',
    service: 'test',
    type: 'time10_test', // Format: action_service
    description: 'Test action: Wait for 10 seconds'
  },
  {
    id: 'test-message',
    service: 'test',
    type: 'sendmessage_test', // Format: action_service 
    description: 'Test action: Send message to terminal'
  }
];

export const availableReactions: Action[] = [
  {
    id: 'test-timer-reaction',
    service: 'test',
    type: 'time10_test', // Format: action_service
    description: 'Test reaction: Wait for 10 seconds'
  },
  {
    id: 'test-message-reaction', 
    service: 'test',
    type: 'sendmessage_test', // Format: action_service
    description: 'Send message to terminal as reaction'
  }
];