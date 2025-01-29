import { Request, Response } from 'express';
import UserModel from '../db/UserModel';

export const logout_service = async (req: Request, res: Response) => {
  try {
    const { name_service, email } = req.body;

    // Validation des champs obligatoires
    if (!name_service || !email) {
      return res.status(400).json({
        message: 'Both "name_service" and "email" fields are required.',
      });
    }

    // Récupérer l'utilisateur par email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email "${email}" not found.` });
    }

    // Vérifier si le champ `service` existe et si le service est défini
    const serviceMap = user.service as Map<string, string>;
    console.log(serviceMap.get(name_service));
    if (!serviceMap || serviceMap.get(name_service) === undefined) {
      return res.status(404).json({
        message: `Service "${name_service}" not found for user "${email}".`,
      });
    }

    // Déconnecter le service en mettant sa valeur à 'false'
    serviceMap.set(name_service, 'false');

    // Enregistrer les modifications dans la base de données
    await user.save();

    return res.status(200).json({
      message: `Service "${name_service}" has been successfully logged out.`,
    });
  } catch (error) {
    console.error('Error in logout_service:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
