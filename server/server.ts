import express, { Request, Response, NextFunction } from 'express';
import https from 'https';
import fs from 'fs';
import passport from 'passport';
import axios from 'axios';
import './linkedinAuth';


const app = express();
const PORT = 5000;

// Middleware Passport
app.use(passport.initialize());

// Route de démarrage de l'authentification LinkedIn
app.get('/api/auth/linkedin', passport.authenticate('linkedin'));

// Route de callback après authentification LinkedIn
app.get(
    '/api/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/' }),
    async (req: Request, res: Response) => {
      try {
        const user = req.user as any; // Ajoutez le type approprié si nécessaire
        const accessToken = user?.accessToken;
  
        if (!accessToken) {
          throw new Error('Access token is missing');
        }
  
        // Faites une requête manuelle pour récupérer les informations utilisateur
        const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const emailResponse = await axios.get(
          'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
  
        res.json({
          message: 'Successfully authenticated with LinkedIn!',
          profile: profileResponse.data, // Informations utilisateur
          email: emailResponse.data, // Adresse e-mail
        });
      } catch (error: any) {
        console.error('Error during LinkedIn callback:', error.message);
        res.status(500).json({ error: error.message });
      }
    }
  );

// Route pour récupérer les informations utilisateur depuis LinkedIn
app.get('/api/auth/userinfo', async (req: Request, res: Response): Promise<void> => {
    try {
      const accessToken = req.headers.authorization?.split(' ')[1];
      if (!accessToken) {
        res.status(401).json({ error: 'Access token is missing!' });
        return;
      }
  
      const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      res.json({ userInfo: response.data });
    } catch (error: any) {
      console.error('Error fetching user info:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
  

// Middleware de gestion des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

// Lecture des certificats SSL/TLS
const privateKey = fs.readFileSync('./ssl/server.key', 'utf8');
const certificate = fs.readFileSync('./ssl/server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Créer le serveur HTTPS
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
