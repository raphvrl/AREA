import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';

// Début des tests
describe('GET /api/getAction', () => {
  it('should return a list of actions', async () => {
    const res = await request(app).get('/api/getAction');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('actions');
    expect(Array.isArray(res.body.actions)).toBe(true);
    expect(res.body.actions).toEqual([
      'receiveEmail_test',
      'repoCreatedGithub',
      'checkNewSongSpotify',
    ]);
  });
});
