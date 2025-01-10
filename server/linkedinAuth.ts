import passport from 'passport';
import { Strategy as LinkedInStrategy, Profile } from 'passport-linkedin-oauth2';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.BACKEND_PORT || 8080;

passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID as string,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
        callbackURL: `https://localhost:${PORT}/api/auth/linkedin/callback`,
        scope: ['openid', 'profile', 'email'],
      },
      async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
        try {
          console.log('Access Token:', accessToken); // Affiche le token pour le debug
          // Vous pouvez stocker ou traiter le token ici
          return done(null, { accessToken }); // Retourne l'accessToken uniquement
        } catch (error) {
          console.error('Error during LinkedIn strategy:', error);
          return done(error, null);
        }
      }
    )
  );

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((obj: Express.User, done) => {
  done(null, obj);
});
