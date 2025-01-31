import { Request, Response } from 'express';
import axios from 'axios';
import userModel from '../db/userModel';
import dotenv from 'dotenv';
dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export const authGithub = (req: Request, res: Response) => {
  const { email, redirect_uri } = req.query;
  const service = '/api/auth/github/callback';

  if (!email || !redirect_uri) {
    return res.status(400).json({ message: 'Email and redirect_uri are required' });
  }

  const scopes = ['user', 'repo', 'notifications'];

  const state = JSON.stringify({ service });

  const githubAuthUrl =
    `https://github.com/login/oauth/authorize?` +
    `client_id=${GITHUB_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirect_uri as string)}&` +
    `scope=${encodeURIComponent(scopes.join(' '))}&` +
    `state=${encodeURIComponent(state)}`;

  res.redirect(githubAuthUrl);
};

export const authGithubCallback = async (req: Request, res: Response) => {
  const { code, email } = req.body;

  if (!code || !email) {
    return res.status(400).json({ message: 'Code and email are required' });
  }

  try {
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

    const { access_token: accessToken } = tokenResponse.data;

    const user = await userModel.findOne({ email });
    if (user) {
      const apiKeysMap = user.apiKeys as Map<string, string>;
      const serviceMap = user.service as Map<string, string>;
      apiKeysMap.set('github', accessToken);
      serviceMap.set('github', 'true');
      await user.save();
    }

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('Error in GitHub callback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};