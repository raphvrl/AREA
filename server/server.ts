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

declare global {
  var githubToken: string | undefined;
}

const app = express();
const PORT = process.env.BACKEND_PORT || 8080;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 8081;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('Missing Telegram configuration');
}

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

app.use(passport.initialize());
app.use(express.json());

// Routes pour les notifications Telegram
app.post('/api/telegram/notify', async (req: Request, res: Response) => {
  try {
    const { title, artist, imageUrl } = req.body;
    console.log('Sending notification with:', { title, artist, imageUrl });
    
    const message = `🎵 Nouvelle musique ajoutée!\n\nTitre: ${title}\nArtiste: ${artist}`;
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Missing Telegram configuration');
    }

    if (!imageUrl) {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message
        })
      });

      const responseData = await response.json();
      console.log('Telegram API response:', responseData);

      if (!response.ok) {
        throw new Error(`Telegram API error: ${JSON.stringify(responseData)}`);
      }
    } else {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          photo: imageUrl,
          caption: message
        })
      });

      const responseData = await response.json();
      console.log('Telegram API response:', responseData);

      if (!response.ok) {
        throw new Error(`Telegram API error: ${JSON.stringify(responseData)}`);
      }
    }

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error: any) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: error.message || 'Unknown error occurred' });
  }
});

// Route pour l'authentification Discord
app.get('/api/auth/discord', (_req: Request, res: Response) => {
  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  if (!DISCORD_CLIENT_ID) {
    console.error('Missing Discord client ID');
    res.redirect(`http://localhost:${FRONTEND_PORT}/login?error=discord_config_missing`);
    return;
  }
  
  const redirectUri = encodeURIComponent(`https://localhost:${PORT}/api/auth/discord/callback`);
  const scope = encodeURIComponent('identify email');
  
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  res.redirect(discordAuthUrl);
});

app.get('/api/auth/discord/callback', async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = `https://localhost:${PORT}/api/auth/discord/callback`;

    if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
      throw new Error('Missing Discord configuration');
    }

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const userData = await userResponse.json();
    res.redirect(`http://localhost:${FRONTEND_PORT}/login?firstName=${userData.username}&lastName=Discord&isFirstLogin=true&discord_token=${tokens.access_token}`);
  } catch (error) {
    console.error('Error during Discord authentication:', error);
    res.redirect(`http://localhost:${FRONTEND_PORT}/login?error=discord_auth_failed`);
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
    const timer = req.body.timer || 30;

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    spotifyApi.setAccessToken(token);

    await spotifyApi.play({
      uris: ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh']
    });

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

    const searchResults = await spotifyApi.searchTracks(
      `track:${req.body.trackName} artist:${req.body.artist}`
    );

    if (!searchResults.body.tracks?.items?.length) {
      res.status(404).json({ error: 'Track not found on Spotify' });
      return;
    }

    const trackId = searchResults.body.tracks.items[0].id;
    await spotifyApi.addToMySavedTracks([trackId]);
    
    res.status(200).json({ message: 'Track saved to favorites' });
  } catch (error) {
    console.error('Error saving track:', error);
    res.status(500).json({ error: 'Failed to save track' });
  }
});

// Route pour l'authentification GitHub
app.get('/api/auth/github', (_req: Request, res: Response) => {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  if (!GITHUB_CLIENT_ID) {
    console.error('Missing GitHub client ID');
    res.redirect(`http://localhost:${FRONTEND_PORT}/login?error=github_config_missing`);
    return;
  }
  
  const redirectUri = encodeURIComponent(`https://localhost:${PORT}/api/auth/github/callback`);
  const scope = encodeURIComponent('user:follow read:user');
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;
  res.redirect(githubAuthUrl);
});

app.get('/api/auth/github/callback', async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code) {
      throw new Error('No code provided');
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json();

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('Missing Discord webhook URL');
    }

    const userTokens: Map<string, string> = new Map();
    userTokens.set(userData.id, accessToken);
    
    console.log('GitHub user data:', {
      id: userData.id,
      login: userData.login,
      name: userData.name
    });

    startReposCheck(accessToken, webhookUrl, userData.login);
    console.log(`Repository check started for user ${userData.login}`);

    res.redirect(`http://localhost:${FRONTEND_PORT}/login?firstName=${userData.name}&lastName=GitHub&isFirstLogin=true&github_token=${accessToken}`);
  } catch (error) {
    console.error('Error during GitHub authentication:', error);
    res.redirect(`http://localhost:${FRONTEND_PORT}/login?error=github_auth_failed`);
  }
});

function startReposCheck(token: string, webhookUrl: string, username: string) {
  let previousRepos: string[] = [];
  console.log(`Starting repos check for user ${username}...`);

  const checkRepositories = async () => {
    try {
      console.log('Checking for new repositories...');
      
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Repo-Notifier'
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('GitHub API Response:', errorData);
        throw new Error(`GitHub API error: ${response.status} - ${errorData}`);
      }

      const repos = await response.json();
      console.log(`Found ${repos.length} repositories, Previous count: ${previousRepos.length}`);
      const currentRepos = repos.map((repo: any) => repo.name);

      // Premier check
      if (previousRepos.length === 0) {
        previousRepos = currentRepos;
        console.log('Initial repos list:', currentRepos);
        return;
      }

      console.log('Current repos:', currentRepos);
      console.log('Previous repos:', previousRepos);

      const newRepos = currentRepos.filter((repo: string) => !previousRepos.includes(repo));
      console.log('New repos detected:', newRepos);

      if (newRepos.length > 0) {
        for (const newRepo of newRepos) {
          console.log(`Processing new repo: ${newRepo}`);
          const repoDetails = repos.find((r: any) => r.name === newRepo);
          
          try {
            console.log('Sending webhook notification...');
            const webhookResponse = await fetch(webhookUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                content: `🎉 Nouveau dépôt GitHub créé par ${username} !\n\n**${newRepo}**\n${repoDetails.description || 'Pas de description'}\n\nURL: ${repoDetails.html_url}`,
                username: 'GitHub Notifier',
                avatar_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
              })
            });

            const responseText = await webhookResponse.text();
            console.log('Webhook response:', responseText);

            if (!webhookResponse.ok) {
              console.error('Discord webhook error:', responseText);
            } else {
              console.log(`Notification sent for new repository: ${newRepo}`);
            }
          } catch (error) {
            console.error(`Error sending notification for ${newRepo}:`, error);
          }
        }

        previousRepos = currentRepos;
      }
    } catch (error) {
      console.error('Error in repository check:', error);
    }
  };

  checkRepositories();

  return setInterval(checkRepositories, 30000);
}

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

