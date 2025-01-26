import { Request, Response } from 'express';
import UserModel from '../db/UserModel';

export const delete_area = async (req: Request, res: Response) => {
    try {
        const { nom_area, email } = req.body;

        // Validation des champs obligatoires
        if (!nom_area || !email) {
            return res.status(400).json({ message: 'Both "nom_area" and "email" fields are required.' });
        }

        // Récupérer l'utilisateur par email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: `User with email "${email}" not found.` });
        }

        // Vérifier si le champ `area` existe et supprimer la zone spécifiée
        const areaMap = user.area as Map<string, { action: string; reaction: string; is_on: string }> | undefined;

        if (!areaMap || !areaMap.has(nom_area)) {
            return res.status(404).json({ message: `Area "${nom_area}" not found for user "${email}".` });
        }

        // Supprimer l'area spécifiée
        areaMap.delete(nom_area);

        // Sauvegarder les modifications dans la base de données
        await user.save();

        return res.status(200).json({ message: `Area "${nom_area}" has been successfully deleted.` });
    } catch (error) {
        console.error('Error in delete_area:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
