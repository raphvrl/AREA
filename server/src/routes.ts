import { Router } from 'express';
import { body, param } from 'express-validator';
import { sign_in, sign_up } from './api/login';
import { set_area } from './api/setArea';
import { get_area } from './api/getArea';
import { getLoginService } from './api/getLoginService';
import { logout_service } from './api/logoutService';
import { delete_area } from './api/delete_area';
import { get_action } from './api/getAction';
import { get_reaction } from './api/getReaction';
import { authSpotify, authSpotifyCallback } from './api/spotifyAuth';
import { authGithub, authGithubCallback } from './api/githubAuth';
const router = Router();

// Route pour sign_up
router.post(
  '/sign_up',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  sign_up
);

// Route pour sign_in
router.post(
  '/sign_in',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  sign_in
);

// Route pour set_area
router.post(
  '/set_area',
  [
    body('email_user').isEmail().withMessage('Invalid email address.'),
    body('nom_area').notEmpty().withMessage('Area name is required.'),
    body('action').notEmpty().withMessage('Action is required.'),
    body('reaction').notEmpty().withMessage('Reaction is required.'),
  ],
  set_area
);

// Route pour get_area
router.get(
  '/get_area/:email_user',
  [param('email_user').isEmail().withMessage('Invalid email address')],
  get_area
);

// Route pour getLoginService
router.post(
  '/get_login_service',
  [body('email').isEmail().withMessage('Invalid email address.')],
  getLoginService
);

// Route pour logout_service
router.post(
  '/logout_service',
  [
    body('name_service').notEmpty().withMessage('Service name is required.'),
    body('email').isEmail().withMessage('Invalid email address.'),
  ],
  logout_service
);
router.delete(
  '/delete_area',
  [
    body('email').isEmail().withMessage('Invalid email address.'),
    body('nom_area').notEmpty().withMessage('Area name is required.'),
  ],
  delete_area // Utilisation de la fonction définie séparément
);

router.get('/get_action', get_action);
router.get('/get_reaction', get_reaction);
router.get('/auth/spotify', authSpotify);
router.get('/auth/spotify/callback', authSpotifyCallback);
router.get('/auth/github', authGithub);
router.get('/auth/github/callback', authGithubCallback);
export default router;
