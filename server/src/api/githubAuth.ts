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

  const scopes = ['user', 'repo', 'notifications', 'user:email'];

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
    const response = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    // Les emails de l'utilisateur
    const emails = response.data;
    const emailUser = emails[0].email;
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
      const userIdAccount = await userModel.findOne({
        email: emailUser,
      });
      if (userIdAccount) {
        const apiKeysMap = userIdAccount.apiKeys as Map<string, string>;
        const serviceMap = userIdAccount.service as Map<string, string>;
        const idServiceMap = userIdAccount.idService as Map<string, string>;
        idServiceMap.set('github', githubUserId.toString()); 
        apiKeysMap.set('github', accessToken);
        serviceMap.set('github', 'true');

        await userIdAccount.save();
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        return res.status(200).json({
          message: 'User found',
          user: {
            firstName: userIdAccount.firstName,
            lastName: userIdAccount.lastName,
            email: userIdAccount.email,
            service: userIdAccount.service,
          },
        });
      }
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
      }     
      const newUser = new userModel({
        firstName: githubUsername,
        lastName: githubUsername,
        email: emailUser,
      });
      await newUser.save();
      const apiKeysMap = newUser.apiKeys as Map<string, string>;
      const serviceMap = newUser.service as Map<string, string>;
      const idServiceMap = newUser.idService as Map<string, string>;
      idServiceMap.set('github', githubUserId.toString()); 
      apiKeysMap.set('github', accessToken);
      serviceMap.set('github', 'true');
      await newUser.save();
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.status(200).json({
        message: 'User found',
        user: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
      });
    }
  } catch (error) {
    console.error('Error in GitHub callback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
