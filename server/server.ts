// server/server.ts
import { createUser, getUserByEmail, updateUserApiKey, updateUserIdService, updateUserService} from './UserController';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from './UserModel';
import loginRoutes from './login';
import https from 'https';
import fs from 'fs';
import passport from 'passport';
import axios from 'axios';
import qs from "qs";
import crypto from "crypto";
import { processMentionsAndLikes } from './mentionProcessor';
import './linkedinAuth';
import connectDB from './db';
import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 8080;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 8081;
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const TWITTER_CALLBACK_URL = process.env.REACT_APP_TWITTER_CALLBACK_URL;
// Configuration CORS
app.use(cors({
  origin: `http://localhost:${FRONTEND_PORT}`,
  credentials: true
}));
// Middleware
app.use(passport.initialize());
app.use(express.json());
// Configuration Spotify
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `https://localhost:${PORT}/api/auth/spotify/callback`
});

// Connexion à MongoDB
connectDB();

app.use(loginRoutes);

// Routes Twitter
app.get("/api/auth/twitter", (req: Request, res: Response) => {
  const state = Math.random().toString(36).substring(7); // Générer un état unique pour la sécurité
  const params = new URLSearchParams({
    response_type: "code",
    client_id: TWITTER_CLIENT_ID!,
    redirect_uri: TWITTER_CALLBACK_URL!,
    scope: "tweet.read tweet.write users.read offline.access like.read like.write",
    state,
    code_challenge: "challenge", // Remplacez par une valeur sécurisée si vous implémentez PKCE
    code_challenge_method: "plain",
  });

  res.redirect(`https://twitter.com/i/oauth2/authorize?${params.toString()}`);
});

app.get("/api/auth/twitter/callback", async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || !state) {
    res.status(400).send("Missing code or state");
    return;
  }

  try {
    const tokenResponse = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      new URLSearchParams({
        code: code as string,
        grant_type: "authorization_code",
        client_id: TWITTER_CLIENT_ID!,
        redirect_uri: TWITTER_CALLBACK_URL!,
        code_verifier: "challenge", // Utilisez la même valeur que dans le challenge de l'étape précédente
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    console.log("Access Token:", access_token);

    // Utiliser l'access token pour récupérer les informations de l'utilisateur
    const userResponse = await axios.get("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = userResponse.data;
    // Sauvegarder les informations dans la base de données
    await updateUserApiKey(
      userInfo.data.name.split(" ")[0], // Prénom
      userInfo.data.name.split(" ").slice(1).join(" "), // Nom
      "X",
      access_token
    );
    await updateUserIdService (
      userInfo.data.name.split(" ")[0], // Prénom
      userInfo.data.name.split(" ").slice(1).join(" "), // Nom
      "X",
      userInfo.data.id
    );
    console.log(`User ${userInfo.data.username} authenticated successfully`);
    res.redirect(`http://localhost:${FRONTEND_PORT}/login?lastName=${userInfo.data.name.split(" ")[0]}&firstName=${userInfo.data.name.split(" ").slice(1).join(" ")}&isFirstLogin=${true}`);
  } catch (error) {
    console.error("Error obtaining access token:", error);
    res.redirect(`http://localhost:${FRONTEND_PORT}/?error=twitter_auth_failed`);
  }
});

// API pour activer ou désactiver l'API X
app.post("/api/service/x", async (req: Request, res: Response) => {
  const { firstName, lastName, is_activate } = req.body;

  if (!firstName || !lastName || typeof is_activate === "undefined") {
    res.status(400).json({ error: "Missing email or is_activate parameter" });
    return;
  }

  try {
    // Mettre à jour le statut du service X dans la base de données
    console.log(firstName, lastName)
    const updatedUser = await updateUserService(firstName, lastName, "X", is_activate);

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: `Service X ${is_activate ? "activated" : "deactivated"} successfully for user ${firstName} ${lastName}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user service:", error);
    res.status(500).json({ error: "Failed to update service status" });
  }
});



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
        apiKeys: {},
        idService: {},
        service: {}
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

(async () => {
  try {
    console.log('Premier traitement des mentions et des likes...');
    await processMentionsAndLikes();
  } catch (error) {
    console.error('Erreur lors du premier appel :', error);
  }

  // Répétition toutes les 15 minutes
  setInterval(async () => {
    try {
      console.log('Traitement périodique des mentions et des likes...');
      await processMentionsAndLikes();
    } catch (error) {
      console.error('Erreur lors du traitement périodique :', error);
    }
  }, 15 * 60 * 1000); // 15 minutes
})();

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

