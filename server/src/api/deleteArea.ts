import { Request, Response } from 'express';
import userModel from '../db/userModel';

export const deleteArea = async (req: Request, res: Response) => {
  try {
    const { nomArea, email } = req.body;

    // Validation des champs obligatoires
    if (!nomArea || !email) {
      return res
        .status(400)
        .json({ message: 'Both "nomArea" and "email" fields are required.' });
    }

    // Récupérer l'utilisateur par email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email "${email}" not found.` });
    }

    // Vérifier si le champ `area` existe et supprimer la zone spécifiée
    const areaMap = user.area as
      | Map<string, { action: string; reaction: string; is_on: string }>
      | undefined;

    if (!areaMap || !areaMap.has(nomArea)) {
      return res
        .status(404)
        .json({ message: `Area "${nomArea}" not found for user "${email}".` });
    }

    // Supprimer l'area spécifiée
    areaMap.delete(nomArea);

    // Sauvegarder les modifications dans la base de données
    await user.save();

    return res
      .status(200)
      .json({ message: `Area "${nomArea}" has been successfully deleted.` });
  } catch (error) {
    console.error('Error in deleteArea:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
