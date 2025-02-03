import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import userModel from '../db/userModel'; // On part du principe que tu as un modèle utilisateur

// Fonction signIn
export const signUp = async (req: Request, res: Response) => {
  try {
    // Validation des champs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Renvoyer les erreurs de validation
    }

    const { email, password } = req.body;

    // Rechercher l'utilisateur par email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Vérifier si `password` existe et est une chaîne
    if (typeof user.password !== 'string') {
      return res.status(500).json({
        message: 'User data is corrupted: password is missing or invalid',
      });
    }

    // Comparer le mot de passe avec le hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
