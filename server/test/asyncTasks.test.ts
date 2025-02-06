import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import userModel from '../src/db/userModel';
import { executeAreas } from '../src/tasks/asyncTasks';
import areaHandlers from '../src/services/areaHandlers';

// Mock des handlers d'actions et de réactions
vi.mock('../src/services/areaHandlers', () => ({
  default: {
    event_spotify: vi.fn(async (email, option) => `action_result_${option}`),
    notify_github: vi.fn(async (email, option, actionResult) => `reaction_result_${actionResult}`),
  },
}));

describe('executeAreas Function', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Création d'un utilisateur avec des "areas"
    await userModel.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      area: new Map([
        ['TestArea', {
          action: 'event_spotify',
          reaction: 'notify_github',
          is_on: 'true',
          option_action: 'optionA',
          option_reaction: 'optionB',
        }],
        ['DisabledArea', {
          action: 'event_spotify',
          reaction: 'notify_github',
          is_on: 'false', // Ne doit pas être exécuté
        }]
      ]),
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should execute enabled areas and call the correct handlers', async () => {
    await executeAreas();

    // Vérifier si les mocks ont été appelés avec les bonnes valeurs
    expect(areaHandlers.event_spotify).toHaveBeenCalledWith('john.doe@example.com', 'optionA');
    expect(areaHandlers.notify_github).toHaveBeenCalledWith('john.doe@example.com', 'optionB', 'action_result_optionA');

    // Vérifier qu'aucune action n'a été exécutée pour une area désactivée
    expect(areaHandlers.event_spotify).toHaveBeenCalledTimes(1);
    expect(areaHandlers.notify_github).toHaveBeenCalledTimes(1);
  });

  it('should handle cases where an action or reaction is missing', async () => {
    await userModel.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      area: new Map([
        ['InvalidArea', {
          action: 'invalid_action',
          reaction: 'notify_github',
          is_on: 'true',
        }],
      ]),
    });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    await executeAreas();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Action "invalid_action" or Reaction "notify_github" not implemented for area "InvalidArea"'
    );

    consoleWarnSpy.mockRestore();
  });

  it('should handle execution errors gracefully', async () => {
    areaHandlers.event_spotify.mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await executeAreas();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error executing area "TestArea" for user "John Doe":'),
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
