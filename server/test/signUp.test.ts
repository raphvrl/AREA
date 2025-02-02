import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/server'; // Importation de l'application Express

describe('POST /api/signUp', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Démarrer MongoDB en mémoire
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Se connecter à MongoDB en mémoire
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Nettoyer la connexion Mongoose
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Cas de test 1 : Création d'un utilisateur avec des données valides
  it('should create a new user with valid data', async () => {
    const res = await request(app)
      .post('/api/signUp')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  // Cas de test 2 : Tentative de création d'un utilisateur avec un email déjà existant
  it('should return 400 if email is already in use', async () => {
    // Créer un utilisateur avec le même email avant de tester
    await request(app)
      .post('/api/signUp')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/signUp')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Email already in use');
  });

  // Cas de test 3 : Tentative de création d'un utilisateur avec des données manquantes
  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/signUp')
      .send({
        firstName: 'John', // lastName et email manquants
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors'); // Vérifier la présence d'erreurs de validation
  });

  // Cas de test 4 : Tentative de création d'un utilisateur avec un mot de passe trop court
  it('should return 400 if password is too short', async () => {
    const res = await request(app)
      .post('/api/signUp')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: '123', // Mot de passe trop court
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });

  // Cas de test 5 : Tentative de création d'un utilisateur avec un email invalide
  it('should return 400 if email is invalid', async () => {
    const res = await request(app)
      .post('/api/signUp')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email', // Email invalide
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });
});
