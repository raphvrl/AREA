import { Request, Response } from 'express';
import userModel from '../db/userModel';

export const logoutService = async (req: Request, res: Response) => {
  try {
    const { nameService, email } = req.body;

    if (!nameService || !email) {
      return res.status(400).json({
        message: 'Both "nameService" and "email" fields are required.',
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email "${email}" not found.` });
    }

    const serviceMap = user.service as Map<string, string>;
    const idServiceMap = user.idService as Map<string, string>;
    const apiKeysMap = user.apiKeys as Map<string, string>;

    if (!serviceMap || serviceMap.get(nameService) === undefined) {
      return res.status(404).json({
        message: `Service "${nameService}" not found for user "${email}".`,
      });
    }

    // Mettre à jour le service à 'false'
    serviceMap.set(nameService, 'false');

    // Supprimer l'idService et l'apiKeys liés au service
    if (idServiceMap.has(nameService)) {
      idServiceMap.delete(nameService);
    }
    if (apiKeysMap.has(nameService)) {
      apiKeysMap.delete(nameService);
    }

    await user.save();

    return res.status(200).json({
      message: `Service "${nameService}" has been successfully logged out and associated data has been removed.`,
    });
  } catch (error) {
    console.error('Error in logoutService:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};