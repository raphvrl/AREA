import { Router } from 'express';
import { body, param } from 'express-validator';
import { signIn, signUp } from './api/login';
import { setArea } from './api/setArea';
import { getArea } from './api/getArea';
import { getLoginService } from './api/getLoginService';
import { logoutService } from './api/logoutService';
import { deleteArea } from './api/deleteArea';
import { getAction } from './api/getAction';
import { getReaction } from './api/getReaction';
import { authSpotify, authSpotifyCallback } from './api/spotifyAuth';
import { authGithub, authGithubCallback } from './api/githubAuth';
import { authLinkedin, authLinkedinCallback } from './api/linkedinAuth';
import { authDropbox, authDropboxCallback } from './api/dropboxAuth';
import { authNotion, authNotionCallback } from './api/notionAuth';
import { authTwitch, authTwitchCallback } from './api/twitchAuth';

const router = Router();

// Route pour signUp
router.post(
  '/signUp',
  [
    body('firstName')
      .notEmpty()
      .withMessage('First name is required'),
    body('lastName')
      .notEmpty()
      .withMessage('Last name is required'),
    body('email')
      .isEmail()
      .withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  signUp
);

// Route pour signIn
router.post(
  '/signIn',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  signIn
);

// Route pour setArea
router.post(
  '/setArea',
  [
    body('emailUser')
      .isEmail()
      .withMessage('Invalid email address.'),
    body('nomArea')
      .notEmpty()
      .withMessage('Area name is required.'),
    body('action')
      .notEmpty()
      .withMessage('Action is required.'),
    body('reaction')
      .notEmpty()
      .withMessage('Reaction is required.'),
    body('option_action')
      .optional()
      .isString()
      .withMessage('Option action must be a string.'),
    body('option_reaction')
      .optional()
      .isString()
      .withMessage('Option reaction must be a string.'),
  ],
  setArea
);

// Route pour getArea
router.get(
  '/getArea/:emailUser',
  [
    param('emailUser')
      .isEmail()
      .withMessage('Invalid email address'),
  ],
  getArea
);

// Route pour getLoginService
router.post(
  '/get_login_service',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email address.'),
  ],
  getLoginService
);

// Route pour logoutService
router.post(
  '/logoutService',
  [
    body('nameService')
      .notEmpty()
      .withMessage('Service name is required.'),
    body('email')
      .isEmail()
      .withMessage('Invalid email address.'),
  ],
  logoutService
);
router.delete(
  '/deleteArea',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email address.'),
    body('nomArea')
      .notEmpty()
      .withMessage('Area name is required.'),
  ],
  deleteArea // Utilisation de la fonction définie séparément
);

router.get('/getAction', getAction);
router.get('/getReaction', getReaction);
router.get('/auth/spotify', authSpotify);
router.post('/auth/spotify/callback', authSpotifyCallback);
router.get('/auth/github', authGithub);
router.post('/auth/github/callback', authGithubCallback);
router.get('/auth/linkedin', authLinkedin);
router.post('/auth/linkedin/callback', authLinkedinCallback);
router.get('/auth/dropbox', authDropbox);
router.post('/auth/dropbox/callback', authDropboxCallback);
router.get('/auth/notion', authNotion);
router.post('/auth/notion/callback', authNotionCallback);
router.get('/auth/twitch', authTwitch);
router.post('/auth/twitch/callback', authTwitchCallback);
export default router;
