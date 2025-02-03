import { Request, Response } from 'express';
import axios from 'axios';
import userModel from '../db/userModel';
import dotenv from 'dotenv';
dotenv.config();

const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET;
const BACKEND_PORT = process.env.BACKEND_PORT || 8080;

export const authDropbox = async (req: Request, res: Response) => {
  const { email, redirectUri } = req.query;
  console.log('email:', email, 'redirectUri:', redirectUri);
  const service = '/api/auth/dropbox/callback';
  if (!email || !redirectUri) {
    return res
      .status(400)
      .json({ message: 'Email and redirect_uri are required' });
  }
  const user = await userModel.findOneAndUpdate(
    { email },
    { redirectUriDropbox: redirectUri },
    { new: true, upsert: true }
  );
  const scopes = [
    'files.metadata.read',
    'files.metadata.write',
    'files.content.read',
    'files.content.write',
  ];

  const state = JSON.stringify({ service });

  const redirectUrl = redirectUri as string;
  const dropboxAuthUrl =
    `https://www.dropbox.com/oauth2/authorize?` +
    `client_id=${DROPBOX_CLIENT_ID}&` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(redirectUrl)}&` +
    `scope=${encodeURIComponent(scopes.join(' '))}&` +
    `state=${encodeURIComponent(state)}`;

  res.redirect(dropboxAuthUrl);
};

export const authDropboxCallback = async (req: Request, res: Response) => {
  const { code, email } = req.body;
  console.log('code:', code, 'email:', email);
  if (!code || !email) {
    return res.status(400).json({ message: 'Code and state are required' });
  }

  try {
    console.log('email:', email);
    const user = await userModel.findOne({ email });
    if (!user || !user.redirectUriDropbox) {
      return res
        .status(400)
        .json({ message: 'Redirect URI not found for this user' });
    }
    const redirectUri = user.redirectUriDropbox as string;

    const tokenResponse = await axios.post(
      'https://api.dropbox.com/oauth2/token',
      new URLSearchParams({
        code: code.toString(),
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        client_id: DROPBOX_CLIENT_ID!,
        client_secret: DROPBOX_CLIENT_SECRET!,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = tokenResponse.data;

    if (user) {
      const apiKeysMap = user.apiKeys as Map<string, string>;
      const serviceMap = user.service as Map<string, string>;
      apiKeysMap.set('dropbox', access_token);
      serviceMap.set('dropbox', 'true');
      await user.save();
      console.log('✅ Token Dropbox sauvegardé pour:', email);
    }

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('Error in Dropbox callback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
