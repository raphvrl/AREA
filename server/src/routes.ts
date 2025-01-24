import { Router } from 'express';
import { body, param } from 'express-validator';
import { sign_in, sign_up } from './api/login';
import { set_area } from './api/setArea';
import { get_area } from './api/getArea';

const router = Router();

// Sign up route
router.post(
    '/sign_up',
    [
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    sign_up
);

// Sign in route
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
    [
        param('email_user').isEmail().withMessage('Invalid email address'),
    ],
    get_area
);

export default router;
