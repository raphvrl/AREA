import { Request, Response } from 'express';
import UserModel from '../db/UserModel';

export const set_area = async (req: Request, res: Response) => {
    try {
        const { email_user, nom_area, action, reaction } = req.body;

        // Validation des champs obligatoires
        if (!email_user || !nom_area || !action || !reaction) {
            return res.status(400).json({ message: 'All fields are required: email_user, nom_area, action, reaction.' });
        }

        // Récupérer l'utilisateur par email
        const user = await UserModel.findOne({ email: email_user });
        if (!user) {
            return res.status(404).json({ message: `User with email "${email_user}" not found.` });
        }

        // Forcer TypeScript à comprendre les types de `service` et `area`
        const serviceMap = user.service as Map<string, string>;
        const areaMap = user.area as Map<string, { action: string; reaction: string; is_on: string }>;

        // Extraire le service depuis action et reaction
        const service_action = action.split('_')[1];
        const service_reaction = reaction.split('_')[1];

        // Vérifier que les services associés à l'action et à la réaction sont connectés
        if (!serviceMap.get(service_action) || serviceMap.get(service_action) !== 'true') {
            return res.status(400).json({ message: `Service "${service_action}" is not connected for action.` });
        }

        if (!serviceMap.get(service_reaction) || serviceMap.get(service_reaction) !== 'true') {
            return res.status(400).json({ message: `Service "${service_reaction}" is not connected for reaction.` });
        }

        // Ajouter ou mettre à jour l'area dans la base de données
        const new_area = {
            action,
            reaction,
            is_on: 'true', // On active l'area par défaut
        };

        areaMap.set(nom_area, new_area);

        // Enregistrer les modifications dans la base de données
        await user.save();

        return res.status(200).json({ message: `Area "${nom_area}" has been successfully added or updated.` });
    } catch (error) {
        console.error('Error in set_area:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
