import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import userModel from '../src/db/userModel';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import nock from 'nock';

describe('Dropbox Authentication API', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await userModel.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      service: new Map(),
      apiKeys: new Map(),
      redirectUriDropbox: '',
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should redirect to Dropbox OAuth URL with correct parameters', async () => {
    const res = await request(app)
      .get('/api/auth/dropbox')
      .query({
        email: 'john.doe@example.com',
        redirectUri: 'http://localhost/callback',
      });

    expect(res.statusCode).toEqual(302); // 302 = Redirection
    expect(res.headers.location).toContain(
      'https://www.dropbox.com/oauth2/authorize'
    );
    expect(res.headers.location).toContain('client_id=');
    expect(res.headers.location).toContain(
      'redirect_uri=http%3A%2F%2Flocalhost%2Fcallback'
    );

    // Vérifier que l'utilisateur a été mis à jour avec le redirectUriDropbox
    const user = await userModel.findOne({ email: 'john.doe@example.com' });
    expect(user?.redirectUriDropbox).toEqual('http://localhost/callback');
  });

  it('should return 400 if email or redirectUri is missing', async () => {
    const res = await request(app)
      .get('/api/auth/dropbox')
      .query({ email: 'john.doe@example.com' });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'Email and redirect_uri are required'
    );
  });

  it('should exchange code for access token and store it', async () => {
    const accessToken = 'mock_access_token';

    // Simuler une réponse de Dropbox OAuth avec nock
    nock('https://api.dropbox.com')
      .post('/oauth2/token')
      .reply(200, { access_token: accessToken });

    const res = await request(app)
      .post('/api/auth/dropbox/callback')
      .send({ code: 'mock_code', email: 'john.doe@example.com' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'OK');

    // Vérifier que l'utilisateur a bien son token enregistré
    const user = await userModel.findOne({ email: 'john.doe@example.com' });
    expect(user?.apiKeys.get('dropbox')).toEqual(accessToken);
    expect(user?.service.get('dropbox')).toEqual('true');
  });

  it('should return 400 if code or email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/dropbox/callback')
      .send({ email: 'john.doe@example.com' });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Code and state are required');
  });

  it('should return 500 if Dropbox token request fails', async () => {
    // Simuler une erreur de réponse OAuth avec nock
    nock('https://api.dropbox.com')
      .post('/oauth2/token')
      .reply(400, { error: 'invalid_grant' });

    const res = await request(app)
      .post('/api/auth/dropbox/callback')
      .send({ code: 'mock_code', email: 'john.doe@example.com' });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message', 'Internal server error');
  });
});
