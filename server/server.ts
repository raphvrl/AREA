import { createUser, getUserByEmail, updateUserApiKey } from './UserController';
import express, { Request, Response, NextFunction } from 'express';
import https from 'https';
import fs from 'fs';
import passport from 'passport';
import axios from 'axios';
import './linkedinAuth';
import connectDB from './db';
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;
const LINKEDIN_CALLBACK_URL = `https://localhost:${PORT}/api/auth/linkedin/callback`;

connectDB();

// Middleware Passport
app.use(passport.initialize());

// Route de démarrage de l'authentification LinkedIn
app.get('/api/auth/linkedin', passport.authenticate('linkedin'));

// Route de callback après authentification LinkedIn
app.get('/api/auth/linkedin/callback', async (req: Request, res: Response): Promise<void> => {
  try {
    const authorizationCode = req.query.code as string;

    if (!authorizationCode) {
      res.status(400).json({ error: 'Authorization code is missing from the callback URL' });
      return;
    }

    const response = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code: authorizationCode,
          redirect_uri: LINKEDIN_CALLBACK_URL,
          client_id: process.env.LINKEDIN_CLIENT_ID || 'your-client-id',
          client_secret: process.env.LINKEDIN_CLIENT_SECRET || 'your-client-secret',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = response.data.access_token;
    if (!accessToken) {
      throw new Error('Failed to retrieve access token');
    }

    const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = profileResponse.data;

    // Logique d'insertion ou de mise à jour dans la base de données
    let isFirstLogin = false;
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      console.log(`User already exists: ${existingUser.email}`);
    } else {
      await createUser({
        firstName: userData.given_name,
        lastName: userData.family_name,
        email: userData.email,
        apiKeys: {}, // Ajoutez les API keys si nécessaire
      });
      isFirstLogin = true;
      console.log(`New user created: ${userData.email}`);
    }

    // Envoyez une réponse au client
    res.redirect(`http://localhost:${FRONTEND_PORT}/login?firstName=${userData.given_name}&lastName=${userData.family_name}&isFirstLogin=${isFirstLogin}`);
  } catch (error) {
    res.redirect('/login?error=LinkedIn%20authentication%20failed');
  }
});


// Middleware de gestion des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

// Lecture des certificats SSL/TLS
const privateKey = fs.readFileSync('./ssl/server.key', 'utf8');
const certificate = fs.readFileSync('./ssl/server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Créer le serveur HTTPS
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
