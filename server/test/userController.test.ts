import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import userModel from '../src/db/userModel';
import {
  getUserByEmail,
  saveUser,
  updateApiKeys,
  updateServices,
  updateIdServices,
  updateRedirectUri,
  updateUserArea,
  getUserAreas,
  updateSpotifySavedTracks,
  updatePassword,
  updateName,
} from '../src/db/userController';

describe('User Service Functions', () => {
  let mongoServer: MongoMemoryServer;
  const testEmail = 'test.user@example.com';

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Création d'un utilisateur de test
    await userModel.create({
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      apiKeys: new Map(),
      service: new Map(),
      idService: new Map(),
      area: new Map(),
      spotify: { savedTracks: [] },
      password: 'testpassword',
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should retrieve a user by email', async () => {
    const user = await getUserByEmail(testEmail);
    expect(user).toBeTruthy();
    expect(user?.email).toBe(testEmail);
  });

  it('should save a new user or update existing user', async () => {
    const updatedUser = await saveUser({ email: testEmail, firstName: 'Updated' });
    expect(updatedUser).toBeTruthy();
    expect(updatedUser?.firstName).toBe('Updated');
  });

  it('should update API keys of a user', async () => {
    const apiKeys = new Map([['service1', 'key1']]);
    const updatedUser = await updateApiKeys(testEmail, apiKeys);
    expect(updatedUser).toBeTruthy();
    expect(updatedUser?.apiKeys.get('service1')).toBe('key1');
  });

  it('should update services of a user', async () => {
    const services = new Map([['github', 'true']]);
    const updatedUser = await updateServices(testEmail, services);
    expect(updatedUser).toBeTruthy();
    expect(updatedUser?.service.get('github')).toBe('true');
  });

  it('should update service IDs of a user', async () => {
    const idServices = new Map([['github', '12345']]);
    const updatedUser = await updateIdServices(testEmail, idServices);
    expect(updatedUser).toBeTruthy();
    expect(updatedUser?.idService.get('github')).toBe('12345');
  });

  it('should update redirect URI for a user', async () => {
    const updatedUser = await updateRedirectUri(testEmail, 'Dropbox', 'https://dropbox.com/auth');
    expect(updatedUser).toBeTruthy();
    expect(updatedUser?.redirectUriDropbox).toBe('https://dropbox.com/auth');
  });

  it('should add or update an area for a user', async () => {
    const areaData = {
      action: 'event_spotify',
      reaction: 'notify_github',
      is_on: 'true',
    };
    const updatedUser = await updateUserArea(testEmail, 'TestArea', areaData);
    expect(updatedUser).toBeTruthy();
    expect(updatedUser?.area.get('TestArea').action).toBe('event_spotify');
  });

  it('should retrieve user areas', async () => {
    const areas = await getUserAreas(testEmail);
    expect(areas).toBeTruthy();
    expect(areas?.get('TestArea')).toBeDefined();
  });

  it('should update Spotify saved tracks', async () => {
    const savedTracks = ['track1', 'track2'];
    const updatedUser = await updateSpotifySavedTracks(testEmail, savedTracks);
    expect(updatedUser).toBeTruthy();
    expect(updatedUser?.spotify.savedTracks).toEqual(savedTracks);
  });

  it('should update user password', async () => {
    const updatedUser = await updatePassword(testEmail, 'newpassword');
    expect(updatedUser).toBeTruthy();
    expect(updatedUser?.password).toBe('newpassword');
  });

  it('should update user name', async () => {
    const updatedUser = await updateName(testEmail, 'NewFirst', 'NewLast');
    expect(updatedUser).toBeTruthy();
    expect(updatedUser?.firstName).toBe('NewFirst');
    expect(updatedUser?.lastName).toBe('NewLast');
  });
});
