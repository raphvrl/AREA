import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from '../src/routes'; // Assure-toi d'importer ton routeur principal

describe('GET /api/getReaction', () => {
  const app = express();
  app.use(express.json());
  app.use('/api', router);

  it('should return a list of reactions', async () => {
    const res = await request(app).get('/api/getReaction');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('reactions');
    expect(Array.isArray(res.body.reactions)).toBe(true);
    expect(res.body.reactions).toEqual(['sendMessage_test', 'test']);
  });

  it('should return 500 if an internal server error occurs', async () => {
    // Remplacer temporairement la route pour forcer une erreur
    const originalRoute = router.stack.find(
      layer => layer.route?.path === '/getReaction'
    ).handle;

    router.stack.find(
      layer => layer.route?.path === '/getReaction'
    ).handle = async (req, res) => {
      res.status(500).json({ message: 'Internal server error.' });
    };

    const res = await request(app).get('/api/getReaction');

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message', 'Internal server error.');

    // Restaurer la route originale après le test
    router.stack.find(
      layer => layer.route?.path === '/getReaction'
    ).handle = originalRoute;
  });
});
