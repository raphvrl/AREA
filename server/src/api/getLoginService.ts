import { Request, Response } from 'express';
import UserModel from '../db/UserModel';

export const getLoginService = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validation du champ obligatoire
    if (!email) {
      return res
        .status(400)
        .json({ message: 'The "email" field is required.' });
    }

    // Récupérer l'utilisateur par email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email "${email}" not found.` });
    }

    // Vérifier si `service` existe et est un objet
    const serviceMap = user.service as Map<string, string> | undefined;
    if (!serviceMap) {
      return res.status(200).json({ activeServices: [] }); // Aucun service actif
    }

    console.log('Service Map:', serviceMap);

    // Parcourir les services pour trouver ceux qui ont la valeur 'true'
    const activeServices: string[] = [];
    for (const [serviceName, value] of serviceMap.entries()) {
      if (value === 'true') {
        activeServices.push(serviceName);
      }
    }

    return res.status(200).json({ activeServices });
  } catch (error) {
    console.error('Error fetching login services:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
