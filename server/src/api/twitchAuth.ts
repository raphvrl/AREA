import { Request, Response } from 'express';
import axios from 'axios';
import userModel from '../db/userModel';
import dotenv from 'dotenv';
dotenv.config();

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

export const authTwitch = async (req: Request, res: Response) => {
  const { email, redirectUri } = req.query;
  const service = '/api/auth/twitch/callback';

  if (!email || !redirectUri) {
    return res.status(400).json({ message: 'Email et redirectUri requis' });
  }

  try {
    await userModel.findOneAndUpdate(
      { email },
      { redirectUriTwitch: redirectUri },
      { new: true, upsert: true }
    );

    const scopes = ['user:read:follows', 'user:edit:follows'].join(' ');

    const state = JSON.stringify({ service });

    const twitchAuthUrl =
      `https://id.twitch.tv/oauth2/authorize?` +
      `client_id=${TWITCH_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri as string)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=${encodeURIComponent(state)}`;

    console.log("🔗 URL d'authentification Twitch générée");
    res.redirect(twitchAuthUrl);
  } catch (error) {
    console.error('❌ Erreur auth Twitch:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const authTwitchCallback = async (req: Request, res: Response) => {
  const { code, email, redirectUri } = req.body;
  console.log('📩 Callback Twitch reçu:', { code: !!code, email });

  if (!code) {
    return res.status(400).json({ message: 'Code et email requis' });
  }

  try {
    if (email) {
      const user = await userModel.findOne({ email });
      if (!user || !user.redirectUriTwitch) {
        console.log('❌ Utilisateur ou redirectUri non trouvé');
        return res
          .status(400)
          .json({ message: 'Utilisateur non trouvé ou redirectUri manquant' });
      }

      const tokenResponse = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        {
          client_id: TWITCH_CLIENT_ID,
          client_secret: TWITCH_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: user.redirectUriTwitch,
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Récupération des informations utilisateur
      const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Client-Id': TWITCH_CLIENT_ID as string,
        },
      });

      const twitchUserId = userResponse.data.data[0].id;
      console.log('👤 ID utilisateur Twitch récupéré:', twitchUserId);

      // Mise à jour des informations utilisateur
      const apiKeysMap = user.apiKeys as Map<string, string>;
      const serviceMap = user.service as Map<string, string>;
      const idServiceMap = user.idService as Map<string, string>;

      apiKeysMap.set('twitch', accessToken);
      serviceMap.set('twitch', 'true');
      idServiceMap.set('twitch', twitchUserId);

      await user.save();
      console.log('💾 Informations utilisateur sauvegardées en BDD');

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      res.status(200).json({ message: 'OK' });
    }
    if (redirectUri) {
      const tokenResponse = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        {
          client_id: TWITCH_CLIENT_ID,
          client_secret: TWITCH_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Récupération des informations utilisateur
      const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Client-Id': TWITCH_CLIENT_ID as string,
        },
      });
      const twitchUserId = userResponse.data.data[0].id;
      console.log('👤 ID utilisateur Twitch récupéré:', twitchUserId);
      const user = await userModel.findOne({
        'idService.twitch': twitchUserId,
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
       }
      }
  } catch (error) {
    console.error('❌ Erreur callback Twitch:', error);

    if (axios.isAxiosError(error)) {
      console.error("Détails de l'erreur:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }

    res.status(500).json({
      message: "Erreur lors de l'authentification Twitch",
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    });
  }
};
