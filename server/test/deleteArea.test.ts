import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/server'; // Importation de l'application Express
import userModel from '../src/db/userModel'; // Importation du modèle utilisateur

describe('DELETE /api/deleteArea', () => {
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

    // Créer un utilisateur de test avec une zone existante
    await userModel.create({
      firstName: 'john',
      lastName: 'doe',
      email: 'john.doe@example.com',
      area: new Map([
        [
          'testArea',
          {
            action: 'testAction',
            reaction: 'testReaction',
            is_on: 'true',
          },
        ],
      ]),
    });
  });

  afterAll(async () => {
    // Nettoyer la connexion Mongoose
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Cas de test 1 : Suppression réussie d'une zone existante
  it('should delete an existing area', async () => {
    const res = await request(app)
      .delete('/api/deleteArea')
      .send({
        nomArea: 'testArea',
        email: 'john.doe@example.com',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      'message',
      'Area "testArea" has been successfully deleted.'
    );

    // Vérifier que la zone a bien été supprimée
    const user = await userModel.findOne({ email: 'john.doe@example.com' });
    expect(user?.area.has('testArea')).toBe(false);
  });

  // Cas de test 2 : Tentative de suppression d'une zone avec des champs manquants
  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .delete('/api/deleteArea')
      .send({
        email: 'john.doe@example.com', // nomArea manquant
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'Both "nomArea" and "email" fields are required.'
    );
  });

  // Cas de test 3 : Tentative de suppression d'une zone pour un utilisateur inexistant
  it('should return 404 if user does not exist', async () => {
    const res = await request(app)
      .delete('/api/deleteArea')
      .send({
        nomArea: 'testArea',
        email: 'nonexistent@example.com', // Utilisateur inexistant
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty(
      'message',
      'User with email "nonexistent@example.com" not found.'
    );
  });

  // Cas de test 4 : Tentative de suppression d'une zone qui n'existe pas
  it('should return 404 if area does not exist', async () => {
    const res = await request(app)
      .delete('/api/deleteArea')
      .send({
        nomArea: 'nonexistentArea', // Zone inexistante
        email: 'john.doe@example.com',
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty(
      'message',
      'Area "nonexistentArea" not found for user "john.doe@example.com".'
    );
  });

  // Cas de test 5 : Erreur interne du serveur
  it('should return 500 if an internal server error occurs', async () => {
    // Simuler une erreur interne en désactivant la base de données
    await mongoose.disconnect();

    const res = await request(app)
      .delete('/api/deleteArea')
      .send({
        nomArea: 'testArea',
        email: 'john.doe@example.com',
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message', 'Internal server error.');

    // Reconnecter à MongoDB pour les autres tests
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
});
