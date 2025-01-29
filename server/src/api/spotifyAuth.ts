import { Request, Response } from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import UserModel from '../db/UserModel';
import dotenv from 'dotenv';
dotenv.config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `http://localhost:${process.env.BACKEND_PORT}/api/auth/spotify/callback`,
});

export const authSpotify = (req: Request, res: Response) => {
  const { email, redirect_uri } = req.query;
  console.log('ZIZI');
  // Vérifier que l'email et l'URL de redirection sont fournis
  if (!email || !redirect_uri) {
    return res
      .status(400)
      .json({ message: 'Email and redirect_uri are required' });
  }

  // Scopes pour les permissions Spotify
  const scopes = [
    'user-modify-playback-state',
    'user-read-playback-state',
    'streaming',
    'app-remote-control',
    'user-read-currently-playing',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-read-private',
    'user-library-modify',
  ];

  // Utiliser l'email et l'URL de redirection comme état pour le callback
  const state = JSON.stringify({ email, redirect_uri });

  // Générer l'URL d'autorisation Spotify
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

  // Rediriger l'utilisateur vers Spotify pour l'autorisation
  res.redirect(authorizeURL);
};

export const authSpotifyCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ message: 'Code and state are required' });
  }

  try {
    // Récupérer l'email et l'URL de redirection depuis l'état
    const { email, redirect_uri } = JSON.parse(state.toString());

    // Échanger le code d'autorisation contre un token d'accès
    const data = await spotifyApi.authorizationCodeGrant(code.toString());
    const { access_token, refresh_token } = data.body;

    // Configurer le token d'accès pour les appels suivants
    spotifyApi.setAccessToken(access_token);

    // Récupérer le profil utilisateur Spotify
    const userProfile = await spotifyApi.getMe();
    const spotifyUserId = userProfile.body.id; // ID utilisateur Spotify

    console.log(email);
    console.log(access_token);
    console.log(spotifyUserId);

    // Mettre à jour l'utilisateur dans la base de données
    const user = await UserModel.findOne({ email });
    if (user) {
      const apiKeysMap = user.apiKeys as Map<string, string>;
      const serviceMap = user.service as Map<string, string>;
      const idServiceMap = user.idService as Map<string, string>;

      // Ajouter les informations Spotify
      apiKeysMap.set('spotify', access_token);
      serviceMap.set('spotify', 'true');
      idServiceMap.set('spotify', spotifyUserId);

      await user.save();
    }

    // Rediriger l'utilisateur vers l'URL du frontend
    res.redirect(redirect_uri.toString());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
