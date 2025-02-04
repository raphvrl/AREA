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
    'account_info.read',
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
  const { code, email, redirectUri } = req.body;
  console.log('code:', code, 'email:', email, 'redirectUri:', redirectUri);

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  try {
    // Si email est fourni, on l'utilise pour sauvegarder les informations
    if (email) {
      console.log('Email provided:', email);

      const user = await userModel.findOne({ email });
      if (!user || !user.redirectUriDropbox) {
        return res
          .status(400)
          .json({ message: 'Redirect URI not found for this user' });
      }

      const redirectUriFromDB = user.redirectUriDropbox as string;
      const tokenResponse = await axios.post(
        'https://api.dropbox.com/oauth2/token',
        new URLSearchParams({
          code: code.toString(),
          grant_type: 'authorization_code',
          redirect_uri: redirectUriFromDB,
          client_id: DROPBOX_CLIENT_ID as string,
          client_secret: DROPBOX_CLIENT_SECRET as string,
        }).toString(), // Ajoute `toString()`
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
      }
      // Récupérer l'ID utilisateur de Dropbox
      const userInfoResponse = await axios.post(
        'https://api.dropboxapi.com/2/users/get_current_account',
        null,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const { account_id: dropboxUserId, name } = userInfoResponse.data;
      console.log('Dropbox User ID:', dropboxUserId);
      if (user) {
        const idServiceMap = user.idService as Map<string, string>;

        idServiceMap.set('dropbox', dropboxUserId); // Remplacer par l'ID réel de Dropbox si nécessaire

        await user.save();
      }
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res
        .status(200)
        .json({ message: 'Dropbox authentication successful' });
    }

    // Si redirectUri est fourni, on recherche par l'ID Dropbox
    if (redirectUri) {
      console.log('Redirect URI provided:', redirectUri);

      // Obtenir l'ID utilisateur Dropbox
      const tokenResponse = await axios.post(
        'https://api.dropbox.com/oauth2/token',
        new URLSearchParams({
          code: code.toString(),
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          client_id: DROPBOX_CLIENT_ID as string,
          client_secret: DROPBOX_CLIENT_SECRET as string,
        }).toString(), // Ajoute `toString()`
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token } = tokenResponse.data;

      // Récupérer l'ID utilisateur de Dropbox
      const userInfoResponse = await axios.post(
        'https://api.dropboxapi.com/2/users/get_current_account',
        null,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { account_id: dropboxUserId, name } = userInfoResponse.data;
      console.log('Dropbox User ID:', dropboxUserId);

      // Rechercher l'utilisateur par ID Dropbox
      const user = await userModel.findOne({
        'idService.dropbox': dropboxUserId,
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

    return res.status(400).json({
      message: 'Invalid parameters. Provide either email or redirectUri.',
    });
  } catch (error) {
    console.error('Error in Dropbox callback:', error);

    // Définir les en-têtes de cache pour éviter la mise en cache
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(500).json({ message: 'Internal server error' });
  }
};
