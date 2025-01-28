import { Request, Response } from 'express';

// Création de la map contenant les actions
const actionsMap = new Map<string, string>([
    ['action1', 'receiveEmail_test'],
]);

// Fonction pour récupérer les actions
export const get_action = async (req: Request, res: Response) => {
    try {
        // Convertir la Map en tableau
        const actionsArray = Array.from(actionsMap.values());

        res.status(200).json({ actions: actionsArray });
    } catch (error) {
        console.error('Error fetching actions:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
