import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import userModel from '../src/db/userModel';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('POST /api/setArea', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    process.env.TELEGRAM_BOT_TOKEN = '';
    process.env.TELEGRAM_CHAT_ID = '';
    process.env.DISCORD_WEBHOOK_URL = '';
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await userModel.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      service: new Map([
        ['spotify', 'true'],
        ['github', 'true'],
        ['discord', 'false'],
        ['dropbox', 'false'],
      ]),
      area: new Map(),
    });
  });

  beforeEach(async () => {
    // Nettoie les areas à chaque test
    await userModel.updateOne(
      { email: 'john.doe@example.com' },
      { $set: { area: new Map() } }
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should successfully create an area', async () => {
    const res = await request(app)
      .post('/api/setArea')
      .send({
        emailUser: 'john.doe@example.com',
        nomArea: 'TestArea',
        action: 'event_spotify',
        reaction: 'notify_github',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      'message',
      'Area "TestArea" has been successfully added or updated.'
    );

    // Vérification en base de données
    const user = await userModel.findOne({ email: 'john.doe@example.com' });
    expect(user?.area.has('TestArea')).toBe(true);
  });

  it('should update an existing area instead of duplicating', async () => {
    await request(app)
      .post('/api/setArea')
      .send({
        emailUser: 'john.doe@example.com',
        nomArea: 'TestArea',
        action: 'event_spotify',
        reaction: 'notify_github',
      });

    const res = await request(app)
      .post('/api/setArea')
      .send({
        emailUser: 'john.doe@example.com',
        nomArea: 'TestArea',
        action: 'event_spotify_updated',
        reaction: 'notify_github',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      'message',
      'Area "TestArea" has been successfully added or updated.'
    );

    // Vérification en base de données
    const user = await userModel.findOne({ email: 'john.doe@example.com' });
    expect(user?.area.get('TestArea')?.action).toEqual('event_spotify_updated');
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/setArea')
      .send({
        emailUser: 'john.doe@example.com',
        nomArea: 'TestArea',
        action: 'event_spotify',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'All fields are required: emailUser, nomArea, action, reaction.'
    );
  });

  it('should return 404 if user does not exist', async () => {
    const res = await request(app)
      .post('/api/setArea')
      .send({
        emailUser: 'nonexistent@example.com',
        nomArea: 'TestArea',
        action: 'event_spotify',
        reaction: 'notify_github',
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty(
      'message',
      'User with email "nonexistent@example.com" not found.'
    );
  });

  it('should return 400 if action service is not connected', async () => {
    const res = await request(app)
      .post('/api/setArea')
      .send({
        emailUser: 'john.doe@example.com',
        nomArea: 'TestArea',
        action: 'event_unknown',
        reaction: 'notify_github',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'Service "unknown" is not connected for action.'
    );
  });

  it('should return 400 if reaction service is not connected', async () => {
    const res = await request(app)
      .post('/api/setArea')
      .send({
        emailUser: 'john.doe@example.com',
        nomArea: 'TestArea',
        action: 'event_spotify',
        reaction: 'notify_dropbox',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'Service "dropbox" is not connected for reaction.'
    );
  });

  it('should return 400 if Telegram configuration is missing', async () => {
    const res = await request(app)
      .post('/api/setArea')
      .send({
        emailUser: 'john.doe@example.com',
        nomArea: 'TestArea',
        action: 'event_spotify',
        reaction: 'notify_telegram',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'Telegram configuration is missing'
    );
  });

  it('should return 400 if Discord webhook URL is missing', async () => {
    const res = await request(app)
      .post('/api/setArea')
      .send({
        emailUser: 'john.doe@example.com',
        nomArea: 'TestArea',
        action: 'event_spotify',
        reaction: 'notify_discord',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'Discord webhook URL is missing'
    );
  });

  it('should return 500 if an internal server error occurs', async () => {
    await mongoose.disconnect();
    const res = await request(app)
      .post('/api/setArea')
      .send({
        emailUser: 'john.doe@example.com',
        nomArea: 'TestArea',
        action: 'event_spotify',
        reaction: 'notify_github',
      });
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message', 'Internal server error.');
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
});
