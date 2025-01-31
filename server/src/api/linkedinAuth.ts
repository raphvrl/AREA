import { Request, Response } from 'express';
import axios from 'axios';
import userModel from '../db/userModel';
import dotenv from 'dotenv';
dotenv.config();

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

export const authLinkedin = async (req: Request, res: Response) => {
  const { email, redirectUri } = req.query;
  const service = '/api/auth/linkedin/callback';

  if (!email || !redirectUri) {
    return res
      .status(400)
      .json({ message: 'Email and redirectUri are required' });
  }

  try {
    // Mettre à jour ou créer l'utilisateur avec le redirectUriLinkedin
    const user = await userModel.findOneAndUpdate(
      { email },
      { redirectUriLinkedin: redirectUri },
      { new: true, upsert: true }
    );

    const scopes = ['openid', 'profile', 'email', 'w_member_social'];
    const state = JSON.stringify({ service });

    const linkedinAuthUrl =
      `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${LINKEDIN_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri as string)}&` +
      `scope=${encodeURIComponent(scopes.join(' '))}&` +
      `state=${encodeURIComponent(state)}`;

    res.redirect(linkedinAuthUrl);
  } catch (error) {
    console.error('Error in LinkedIn auth:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const authLinkedinCallback = async (req: Request, res: Response) => {
  const { code, email } = req.body;
  console.log('coucou');

  if (!code || !email) {
    return res.status(400).json({ message: 'Code and email are required' });
  }

  try {
    // Récupérer l'utilisateur et son redirectUriLinkedin
    const user = await userModel.findOne({ email });
    if (!user || !user.redirectUriLinkedin) {
      return res
        .status(400)
        .json({ message: 'Redirect URI not found for this user' });
    }

    const redirectUri = user.redirectUriLinkedin as string;
    console.log(redirectUri);

    // Créer un objet URLSearchParams pour formater les données en x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code.toString());
    params.append('redirect_uri', redirectUri); // Utilisation du redirectUri stocké en DB
    params.append('client_id', LINKEDIN_CLIENT_ID as string);
    params.append('client_secret', LINKEDIN_CLIENT_SECRET as string);

    // Échanger le code contre un access_token
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      params, // Utiliser URLSearchParams ici
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token: accessToken } = tokenResponse.data;

    // Récupérer l'ID de l'utilisateur LinkedIn
    const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'LinkedIn-Version': '202401',
      },
    });

    const linkedInUserId = profileResponse.data.id; // ID de l'utilisateur LinkedIn

    // Mettre à jour l'utilisateur dans la base de données avec l'access token et l'ID LinkedIn
    if (user) {
      const apiKeysMap = user.apiKeys as Map<string, string>;
      const serviceMap = user.service as Map<string, string>;
      const idServiceMap = user.idService as Map<string, string>;

      apiKeysMap.set('linkedin', accessToken); // Stocker le token d'accès
      serviceMap.set('linkedin', 'true'); // Marquer LinkedIn comme connecté
      idServiceMap.set('linkedin', linkedInUserId); // Stocker l'ID LinkedIn

      await user.save();
    }

    // Définir les en-têtes de cache pour éviter la mise en cache
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Renvoyer une réponse JSON et terminer la requête
    res.status(200).json({ message: 'OK', linkedInUserId });
    return; // Assurez-vous de terminer la fonction ici
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
