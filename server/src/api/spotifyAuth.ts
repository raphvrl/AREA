import { Request, Response } from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import userModel from '../db/userModel';
import { getServerIp } from '../utils/giveIp';
import dotenv from 'dotenv';
dotenv.config();

// Initialisation de SpotifyWebApi sans redirectUri pour le moment
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export const authSpotify = (req: Request, res: Response) => {
  const { email, redirectUri } = req.query;

  // Vérification des paramètres requis
  if (!email || !redirectUri) {
    return res
      .status(400)
      .json({ message: 'Email and redirectUri are required' });
  }

  // Définition dynamique du redirectUri
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
  ];

  const state = JSON.stringify({ email, redirectUri });

  // Création de l'URL d'autorisation
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

  // Redirection vers l'URL d'autorisation Spotify
  res.redirect(authorizeURL);
};

export const authSpotifyCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ message: 'Code and state are required' });
  }

  try {
    const { email, redirectUri } = JSON.parse(state.toString());

    const data = await spotifyApi.authorizationCodeGrant(code.toString());
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
    } = data.body;

    spotifyApi.setAccessToken(accessToken);

    const userProfile = await spotifyApi.getMe();
    const spotifyUserId = userProfile.body.id;

    console.log(email);
    console.log(accessToken);
    console.log(spotifyUserId);

    const user = await userModel.findOne({ email });
    if (user) {
      const apiKeysMap = user.apiKeys as Map<string, string>;
      const serviceMap = user.service as Map<string, string>;
      const idServiceMap = user.idService as Map<string, string>;

      apiKeysMap.set('spotify', accessToken);
      serviceMap.set('spotify', 'true');
      idServiceMap.set('spotify', spotifyUserId);

      await user.save();
    }

    // Renvoyer les données au frontend au lieu de rediriger
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
