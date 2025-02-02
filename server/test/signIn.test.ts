import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/server'; // Importation de l'application Express
import userModel from '../src/db/userModel'; // Importation du modèle utilisateur
import bcrypt from 'bcryptjs';

describe('POST /api/signIn', () => {
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

    // Créer un utilisateur de test pour les cas de succès
    const hashedPassword = await bcrypt.hash('password123', 10);
    await userModel.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
    });
  });

  afterAll(async () => {
    // Nettoyer la connexion Mongoose
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Cas de test 1 : Connexion réussie avec des identifiants valides
  it('should log in a user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/signIn')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body.user).toEqual({
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  // Cas de test 2 : Tentative de connexion avec un email inexistant
  it('should return 404 if email does not exist', async () => {
    const res = await request(app)
      .post('/api/signIn')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  // Cas de test 3 : Tentative de connexion avec un mot de passe incorrect
  it('should return 400 if password is incorrect', async () => {
    const res = await request(app)
      .post('/api/signIn')
      .send({
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  // Cas de test 4 : Tentative de connexion avec des données manquantes
  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/signIn')
      .send({
        email: 'john.doe@example.com', // Mot de passe manquant
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors'); // Vérifier la présence d'erreurs de validation
  });
});
