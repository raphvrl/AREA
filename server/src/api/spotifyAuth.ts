import { Request, Response } from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import UserModel from '../db/UserModel';
import dotenv from 'dotenv';
dotenv.config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `http://localhost:${process.env.BACKEND_PORT}/api/auth/spotify/callback`
});

export const authSpotify = (req: Request, res: Response) => {
    const { email, redirect_uri } = req.query;
    if (!email || !redirect_uri) {
        return res.status(400).json({ message: 'Email and redirect_uri are required' });
    }

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
        'user-library-read'
    ];

    const state = JSON.stringify({ email, redirect_uri });

    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

    res.redirect(authorizeURL);
};

export const authSpotifyCallback = async (req: Request, res: Response) => {
    const { code, state } = req.query;

    if (!code || !state) {
        return res.status(400).json({ message: 'Code and state are required' });
    }

    try {
        const { email, redirect_uri } = JSON.parse(state.toString());

        const data = await spotifyApi.authorizationCodeGrant(code.toString());
        const { access_token, refresh_token } = data.body;

        spotifyApi.setAccessToken(access_token);

        const userProfile = await spotifyApi.getMe();
        const spotifyUserId = userProfile.body.id;

        console.log(email);
        console.log(access_token);
        console.log(spotifyUserId);

        const user = await UserModel.findOne({ email });
        if (user) {
            const apiKeysMap = user.apiKeys as Map<string, string>;
            const serviceMap = user.service as Map<string, string>;
            const idServiceMap = user.idService as Map<string, string>;

            apiKeysMap.set('spotify', access_token);
            serviceMap.set('spotify', 'true');
            idServiceMap.set('spotify', spotifyUserId);

            await user.save();
        }

        res.redirect(redirect_uri.toString());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
