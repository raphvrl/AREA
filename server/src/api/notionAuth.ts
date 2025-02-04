import { Request, Response } from 'express';
import axios from 'axios';
import userModel from '../db/userModel';
import dotenv from 'dotenv';
dotenv.config();

const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID;
const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;
const BACKEND_PORT = process.env.BACKEND_PORT || 8080;

export const authNotion = async (req: Request, res: Response) => {
  const { email, redirectUri } = req.query;
  const service = '/api/auth/notion/callback';
  if (!email || !redirectUri) {
    return res
      .status(400)
      .json({ message: 'Email and redirect_uri are required' });
  }
  const user = await userModel.findOneAndUpdate(
    { email },
    { redirectUriNotion: redirectUri },
    { new: true, upsert: true }
  );
  const state = JSON.stringify({ service });
  const scopes = [
    'user:read',
    'page:read',
    'page:write',
    'database:read',
    'database:write',
  ];

  const notionAuthUrl =
    `https://api.notion.com/v1/oauth/authorize?` +
    `client_id=${NOTION_CLIENT_ID}&` +
    `response_type=code&` +
    `owner=user&` +
    `redirect_uri=${encodeURIComponent(redirectUri as string)}&` +
    `state=${encodeURIComponent(state)}`;

  res.redirect(notionAuthUrl);
};

export const authNotionCallback = async (req: Request, res: Response) => {
  const { code, email, redirectUri } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code and state are required' });
  }

  try {
    if (email) {
      const user = await userModel.findOne({ email });
      if (!user || !user.redirectUriNotion) {
        return res
          .status(400)
          .json({ message: 'Redirect URI not found for this user' });
      }
      const redirectUriNotion = user.redirectUriNotion as string;
      console.log(redirectUri);
      const tokenResponse = await axios.post(
        'https://api.notion.com/v1/oauth/token',
        {
          grant_type: 'authorization_code',
          code: code.toString(),
          redirect_uri: redirectUriNotion,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`
            ).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { access_token } = tokenResponse.data;
      // Récupérer les informations de l'utilisateur
      const userInfoResponse = await axios.get(
        'https://api.notion.com/v1/users/me',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Notion-Version': '2022-06-28', // Utilisez la version la plus récente de l'API
          },
        }
      );

      const userId = userInfoResponse.data.id;
      if (user) {
        const apiKeysMap = user.apiKeys as Map<string, string>;
        const serviceMap = user.service as Map<string, string>;
        const idServiceMap = user.idService as Map<string, string>;
        apiKeysMap.set('notion', access_token);
        serviceMap.set('notion', 'true');
        idServiceMap.set('notion', userId);
        await user.save();
      }

      // Définir les en-têtes de cache pour éviter la mise en cache
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      // Renvoyer une réponse JSON et terminer la requête
      res.status(200).json({ message: 'OK' });
      return; // Assurez-vous de terminer la fonction ici
    }
    if (redirectUri) {
      const tokenResponse = await axios.post(
        'https://api.notion.com/v1/oauth/token',
        {
          grant_type: 'authorization_code',
          code: code.toString(),
          redirect_uri: redirectUri,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`
            ).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const { access_token } = tokenResponse.data;
      // Récupérer les informations de l'utilisateur
      const userInfoResponse = await axios.get(
        'https://api.notion.com/v1/users/me',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Notion-Version': '2022-06-28', // Utilisez la version la plus récente de l'API
          },
        }
      );

      const userId = userInfoResponse.data.id;
      const user = await userModel.findOne({
        'idService.notion': userId,
      });
      if (user) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        return res.status(200).json({
          message: 'User found',
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            service: user.service,
          },
        });
      } else {
        return res
          .status(404)
          .json({ message: 'No user found with this Dropbox ID' });
      }
    }
  } catch (error) {
    console.error('Error in LinkedIn callback:', error);

    // Définir les en-têtes de cache pour éviter la mise en cache
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Renvoyer une réponse d'erreur
    res.status(500).json({ message: 'Internal server error' });
    return; // Assurez-vous de terminer la fonction ici
  }
};
