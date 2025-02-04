import { Request, Response } from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import UserModel from '../db/userModel';
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
  const service = '/api/auth/spotify/callback';
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

  const state = JSON.stringify({ service });

  // Création de l'URL d'autorisation
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

  // Redirection vers l'URL d'autorisation Spotify
  res.redirect(authorizeURL);
};

export const authSpotifyCallback = async (req: Request, res: Response) => {
  const { code, email, redirectUri } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code.toString());
    const { access_token, refresh_token } = data.body;

    spotifyApi.setAccessToken(access_token);

    const userProfile = await spotifyApi.getMe();
    const spotifyUserId = userProfile.body.id;

    console.log('Spotify ID:', spotifyUserId);
    console.log('Access Token:', access_token);

    if (email) {
      console.log('User email:', email);
      const user = await UserModel.findOne({ email });

      if (user) {
        const apiKeysMap = user.apiKeys as Map<string, string>;
        const serviceMap = user.service as Map<string, string>;
        const idServiceMap = user.idService as Map<string, string>;

        apiKeysMap.set('spotify', access_token);
        serviceMap.set('spotify', 'true');
        idServiceMap.set('spotify', spotifyUserId);

        await user.save();
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        return res.status(200).json({
          message: 'Login successful',
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });
      } else {
        return res
          .status(404)
          .json({ message: 'No user found with this Spotify ID' });
      }
    }

    if (redirectUri) {
      console.log('Checking login with Spotify ID:', spotifyUserId);
      const user = await UserModel.findOne({
        [`idService.spotify`]: spotifyUserId,
      });

      if (user) {
        console.log(
          'firstName',
          user.firstName,
          'lastName',
          user.lastName,
          'email',
          user.email
        );
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        return res.status(200).json({
          message: 'User found',
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        });
      } else {
        return res
          .status(404)
          .json({ message: 'No user found with this Spotify ID' });
      }
    }
    return res.status(400).json({
      message: 'Invalid parameters. Provide either email or redirectUri.',
    });
  } catch (error) {
    console.error('Error in authSpotifyCallback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
