import { Request, Response } from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import UserModel from '../db/userModel';
import dotenv from 'dotenv';
dotenv.config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export const authSpotify = (req: Request, res: Response) => {
  const { email, redirectUri } = req.query;
  const service = '/api/auth/spotify/callback';
  
  if (!redirectUri) {
    return res.status(400).json({ message: 'redirectUri is required' });
  }

  spotifyApi.setRedirectURI(redirectUri as string);

  const scopes = [
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-modify-playback-state',
    'user-read-playback-state',
    'streaming',
    'app-remote-control',
    'user-read-currently-playing',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-read-private',
    'user-library-modify',
    'user-library-read',
    'user-read-email',
  ];

  const state = JSON.stringify({ service, email });
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authorizeURL);
};

export const authSpotifyCallback = async (req: Request, res: Response) => {
  const { code, email, redirectUri } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code requis' });
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code.toString());
    const { access_token } = data.body;

    spotifyApi.setAccessToken(access_token);
    const userProfile = await spotifyApi.getMe();
    const {
      id: spotifyUserId,
      display_name: spotifyName,
      email: spotifyEmail
    } = userProfile.body;

    console.log('Infos Spotify:', {
      id: spotifyUserId,
      name: spotifyName,
      email: spotifyEmail
    });

    // Rechercher l'utilisateur par email ou ID Spotify
    let user = await UserModel.findOne({
      $or: [
        { email: email || spotifyEmail },
        { 'idService.spotify': spotifyUserId }
      ]
    });

    if (user) {
      // Mise à jour des infos Spotify pour un utilisateur existant
      const apiKeysMap = user.apiKeys as Map<string, string>;
      const serviceMap = user.service as Map<string, string>;
      const idServiceMap = user.idService as Map<string, string>;

      apiKeysMap.set('spotify', access_token);
      serviceMap.set('spotify', 'true');
      idServiceMap.set('spotify', spotifyUserId);

      await user.save();
    } else {
      // Création automatique d'un nouveau compte
      const nameParts = spotifyName ? spotifyName.split(' ') : ['Utilisateur', 'Spotify'];
      user = new UserModel({
        firstName: nameParts[0] || 'Utilisateur',
        lastName: nameParts[1] || 'Spotify',
        email: spotifyEmail,
        password: '', // Pas besoin de mot de passe pour l'auth OAuth
        apiKeys: new Map([['spotify', access_token]]),
        service: new Map([['spotify', 'true']]),
        idService: new Map([['spotify', spotifyUserId]]),
        isOAuthUser: true
      });

      await user.save();
      console.log('✅ Nouveau compte créé avec Spotify:', {
        email: spotifyEmail,
        name: spotifyName
      });
    }

    // Configuration des headers pour éviter la mise en cache
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.status(200).json({
      message: user.isOAuthUser ? 'Compte créé et connecté avec succès' : 'Authentification Spotify réussie',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isFirstLogin: user.isOAuthUser
      }
    });

  } catch (error) {
    console.error('Erreur callback Spotify:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};