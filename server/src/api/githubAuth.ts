import { Request, Response } from 'express';
import axios from 'axios';
import userModel from '../db/userModel';
import dotenv from 'dotenv';
dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export const authGithub = (req: Request, res: Response) => {
  const { email, redirectUri } = req.query;
  const service = '/api/auth/github/callback';

  if (!email || !redirectUri) {
    return res
      .status(400)
      .json({ message: 'Email and redirectUri are required' });
  }

  const scopes = ['user', 'repo', 'notifications'];

  const state = JSON.stringify({ service });

  const githubAuthUrl =
    `https://github.com/login/oauth/authorize?` +
    `client_id=${GITHUB_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri as string)}&` +
    `scope=${encodeURIComponent(scopes.join(' '))}&` +
    `state=${encodeURIComponent(state)}`;

  res.redirect(githubAuthUrl);
};

export const authGithubCallback = async (req: Request, res: Response) => {
  const { code, email, redirectUri } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
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
    if (!accessToken) {
      return res
        .status(400)
        .json({ message: 'Failed to retrieve GitHub access token' });
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const { id: githubUserId, login: githubUsername } = userResponse.data;

    console.log('GitHub ID:', githubUserId);
    console.log('GitHub Username:', githubUsername);

    if (email) {
      const user = await userModel.findOne({ email });

      if (user) {
        const apiKeysMap = user.apiKeys as Map<string, string>;
        const serviceMap = user.service as Map<string, string>;
        const idServiceMap = user.idService as Map<string, string>;

        apiKeysMap.set('github', accessToken);
        serviceMap.set('github', 'true');
        idServiceMap.set('github', githubUserId.toString()); // Stocker l'ID GitHub

        await user.save();
      }

      return res
        .status(200)
        .json({ message: 'GitHub authentication successful' });
    }

    if (redirectUri) {
      console.log('Checking login with GitHub ID:', githubUserId);
      const user = await userModel.findOne({
        [`idService.github`]: githubUserId.toString(),
      });

      if (user) {
        return res.status(200).json({
          message: 'User found',
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            service: user.service,
            apiKeys: user.apiKeys,
          },
        });
      } else {
        return res
          .status(404)
          .json({ message: 'No user found with this GitHub ID' });
      }
    }

    return res.status(400).json({
      message: 'Invalid parameters. Provide either email or redirectUri.',
    });
  } catch (error) {
    console.error('Error in GitHub callback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
