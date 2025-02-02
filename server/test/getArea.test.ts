import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import userModel from '../src/db/userModel';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('GET /api/getArea/:emailUser', () => {
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
      area: new Map([
        [
          'testArea',
          { action: 'testAction', reaction: 'testReaction', is_on: 'true' },
        ],
      ]),
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should return the user areas', async () => {
    const res = await request(app).get('/api/getArea/john.doe@example.com');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('areas');
    expect(Array.isArray(res.body.areas)).toBe(true);
    expect(res.body.areas).toEqual([
      {
        nomArea: 'testArea',
        action: 'testAction',
        reaction: 'testReaction',
        is_on: 'true',
      },
    ]);
  });

  it('should return 400 if emailUser is missing', async () => {
    const res = await request(app).get('/api/getArea/');
    expect(res.statusCode).toEqual(404); // Express renvoie une 404 si le paramètre est manquant
  });

  it('should return 404 if user is not found', async () => {
    const res = await request(app).get('/api/getArea/nonexistent@example.com');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty(
      'message',
      'User with email "nonexistent@example.com" not found.'
    );
  });

  it('should return an empty array if user has no areas', async () => {
    await userModel.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      area: new Map(),
    });
    const res = await request(app).get('/api/getArea/jane.doe@example.com');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('areas');
    expect(res.body.areas).toEqual([]);
  });
});
