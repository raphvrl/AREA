import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import userModel from '../src/db/userModel';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('POST /api/get_login_service', () => {
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

  it('should return active services for a valid user', async () => {
    const res = await request(app)
      .post('/api/get_login_service')
      .send({ email: 'john.doe@example.com' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('activeServices');
    expect(Array.isArray(res.body.activeServices)).toBe(true);
    expect(res.body.activeServices).toEqual(['Spotify', 'LinkedIn']);
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/get_login_service')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'The "email" field is required.'
    );
  });

  it('should return 404 if user is not found', async () => {
    const res = await request(app)
      .post('/api/get_login_service')
      .send({ email: 'nonexistent@example.com' });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty(
      'message',
      'User with email "nonexistent@example.com" not found.'
    );
  });

  it('should return an empty array if user has no active services', async () => {
    await userModel.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      service: new Map([
        ['Spotify', 'false'],
        ['GitHub', 'false'],
        ['LinkedIn', 'false'],
      ]),
    });

    const res = await request(app)
      .post('/api/get_login_service')
      .send({ email: 'jane.doe@example.com' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('activeServices');
    expect(res.body.activeServices).toEqual([]);
  });

  it('should return 500 if an internal server error occurs', async () => {
    // Simuler une erreur interne en désactivant la base de données
    await mongoose.disconnect();

    const res = await request(app)
      .post('/api/get_login_service')
      .send({ email: 'john.doe@example.com' });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message', 'Internal server error.');

    // Reconnecter à MongoDB pour les autres tests
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
});
