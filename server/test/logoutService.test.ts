import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import userModel from '../src/db/userModel';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('POST /api/logoutService', () => {
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
      service: new Map([
        ['Spotify', 'true'],
        ['GitHub', 'false'],
        ['LinkedIn', 'true'],
      ]),
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should successfully log out of a valid service', async () => {
    const res = await request(app)
      .post('/api/logoutService')
      .send({
        nameService: 'Spotify',
        email: 'john.doe@example.com',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      'message',
      'Service "Spotify" has been successfully logged out.'
    );

    const user = await userModel.findOne({ email: 'john.doe@example.com' });
    expect(user?.service.get('Spotify')).toEqual('false');
  });

  it('should return 400 if nameService is missing', async () => {
    const res = await request(app)
      .post('/api/logoutService')
      .send({
        email: 'john.doe@example.com',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'Both "nameService" and "email" fields are required.'
    );
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/logoutService')
      .send({
        nameService: 'Spotify',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'Both "nameService" and "email" fields are required.'
    );
  });

  it('should return 404 if user does not exist', async () => {
    const res = await request(app)
      .post('/api/logoutService')
      .send({
        nameService: 'Spotify',
        email: 'nonexistent@example.com',
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty(
      'message',
      'User with email "nonexistent@example.com" not found.'
    );
  });

  it('should return 404 if service does not exist for the user', async () => {
    const res = await request(app)
      .post('/api/logoutService')
      .send({
        nameService: 'NonExistentService',
        email: 'john.doe@example.com',
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty(
      'message',
      'Service "NonExistentService" not found for user "john.doe@example.com".'
    );
  });

  it('should return 500 if an internal server error occurs', async () => {
    await mongoose.disconnect();

    const res = await request(app)
      .post('/api/logoutService')
      .send({
        nameService: 'Spotify',
        email: 'john.doe@example.com',
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message', 'Internal server error.');

    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
});
