// server/server.ts
import { createUser, getUserByEmail, updateUserApiKey } from './UserController';
import express, { Request, Response, NextFunction } from 'express';
import https from 'https';
import fs from 'fs';
import passport from 'passport';
import axios from 'axios';
import './linkedinAuth';
import connectDB from './db';
import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 8080;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 8081;

// Configuration CORS
app.use(cors({
  origin: `http://localhost:${FRONTEND_PORT}`,
  credentials: true
}));

// Configuration Spotify
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `https://localhost:${PORT}/api/auth/spotify/callback`
});

// Connexion à MongoDB
connectDB();

// Middleware
app.use(passport.initialize());
app.use(express.json());

// Routes LinkedIn
app.get('/api/auth/linkedin', passport.authenticate('linkedin'));

app.get('/api/auth/linkedin/callback', async (req: Request, res: Response): Promise<void> => {
  try {
    const authorizationCode = req.query.code as string;

    if (!authorizationCode) {
      res.status(400).json({ error: 'Authorization code is missing' });
      return;
    }

    const response = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code: authorizationCode,
          redirect_uri: `https://localhost:${PORT}/api/auth/linkedin/callback`,
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
    let isFirstLogin = false;
    
    const existingUser = await getUserByEmail(userData.email);
    if (!existingUser) {
      await createUser({
        firstName: userData.given_name,
        lastName: userData.family_name,
        email: userData.email,
        apiKeys: {}
      });
      isFirstLogin = true;
    }

    res.redirect(`http://localhost:${FRONTEND_PORT}/login?firstName=${userData.given_name}&lastName=${userData.family_name}&isFirstLogin=${isFirstLogin}`);
  } catch (error) {
    console.error('Error during LinkedIn authentication:', error);
    res.redirect('/login?error=linkedin_auth_failed');
  }
});

// Routes Spotify
app.get('/api/auth/spotify', (_req: Request, res: Response) => {
  const scopes = [
    'user-modify-playback-state',
    'user-read-playback-state',
    'streaming',
    'app-remote-control',
    'user-read-currently-playing',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-read-private',
    'user-library-modify'
  ];
  const state = Math.random().toString(36).substring(7);
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authorizeURL);
});

app.get('/api/auth/spotify/callback', async (req: Request, res: Response) => {
  const { code } = req.query;
  
  try {
    const data = await spotifyApi.authorizationCodeGrant(code as string);
    const { access_token, refresh_token } = data.body;
    
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    
    res.redirect(`http://localhost:${FRONTEND_PORT}/login?spotify_token=${access_token}&firstName=Spotify&lastName=User&isFirstLogin=true`);
  } catch (error) {
    console.error('Error getting Spotify tokens:', error);
    res.redirect('http://localhost:${FRONTEND_PORT}/login?error=spotify_auth_failed');
  }
});

app.post('/api/spotify/play', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const timer = req.body.timer || 30; // Valeur par défaut de 30 secondes

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    spotifyApi.setAccessToken(token);

    // Lancer la lecture
    await spotifyApi.play({
      uris: ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh']
    });

    // Mettre en pause après le délai spécifié
    setTimeout(async () => {
      try {
        await spotifyApi.pause();
        console.log('Music paused after timer');
      } catch (error) {
        console.error('Error pausing playback:', error);
      }
    }, timer * 1000);
    
    res.status(200).json({ message: `Playing track with ${timer}s timer` });
  } catch (error: any) {
    console.error('Error playing track:', error);
    
    if (error.statusCode === 401) {
      res.status(401).json({ error: 'Spotify authentication required' });
      return;
    }
    
    res.status(500).json({ error: 'Failed to play track' });
  }
});

app.post('/api/spotify/save-track', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    spotifyApi.setAccessToken(token);

    // Rechercher la track sur Spotify
    const searchResults = await spotifyApi.searchTracks(
      `track:${req.body.trackName} artist:${req.body.artist}`
    );

    // Vérification de sécurité pour les tracks
    if (!searchResults.body.tracks?.items?.length) {
      res.status(404).json({ error: 'Track not found on Spotify' });
      return;
    }

    // Maintenant on peut accéder au trackId en toute sécurité
    const trackId = searchResults.body.tracks.items[0].id;
    await spotifyApi.addToMySavedTracks([trackId]);
    
    res.status(200).json({ message: 'Track saved to favorites' });
  } catch (error) {
    console.error('Error saving track:', error);
    res.status(500).json({ error: 'Failed to save track' });
  }
});

// Middleware de gestion des erreurs
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

// Configuration SSL et démarrage du serveur
const privateKey = fs.readFileSync('./ssl/server.key', 'utf8');
const certificate = fs.readFileSync('./ssl/server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

https.createServer(credentials, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});