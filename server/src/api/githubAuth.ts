import { Request, Response } from 'express';
import axios from 'axios';
import UserModel from '../db/UserModel';
import dotenv from 'dotenv';
dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const BACKEND_PORT = process.env.BACKEND_PORT || 8080;

export const authGithub = (req: Request, res: Response) => {
  const { email, redirect_uri } = req.query;

  if (!email || !redirect_uri) {
    return res
      .status(400)
      .json({ message: 'Email and redirect_uri are required' });
  }

  const scopes = ['user', 'repo', 'notifications'];

  const state = JSON.stringify({ email, redirect_uri });

  const redirectUri = `http://localhost:${BACKEND_PORT}/api/auth/github/callback`;
  const githubAuthUrl =
    `https://github.com/login/oauth/authorize?` +
    `client_id=${GITHUB_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scopes.join(' '))}&` +
    `state=${encodeURIComponent(state)}`;

  res.redirect(githubAuthUrl);
};

export const authGithubCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ message: 'Code and state are required' });
  }

  try {
    const { email, redirect_uri } = JSON.parse(state.toString());

    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const { access_token } = tokenResponse.data;

    const user = await UserModel.findOne({ email });
    if (user) {
      const apiKeysMap = user.apiKeys as Map<string, string>;
      const serviceMap = user.service as Map<string, string>;
      apiKeysMap.set('github', access_token);
      serviceMap.set('github', 'true');
      await user.save();
    }

    res.redirect(redirect_uri.toString());
  } catch (error) {
    console.error('Error in GitHub callback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
