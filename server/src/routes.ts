import { Router } from 'express';
import { body } from 'express-validator';
import { sign_in, sign_up } from './api/login';

const router = Router();

// Route pour sign_in
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

// Route pour login
router.post(
    '/sign_in',
    [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    sign_in
);

export default router;
