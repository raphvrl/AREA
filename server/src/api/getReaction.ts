import { Request, Response } from 'express';

// Création de la map contenant les réactions
const reactionsMap = new Map<string, string>([
    ['reaction1', 'sendMessage_test'],
    ['reaction2', 'zizi_test']
]);

// Fonction pour récupérer les réactions
export const get_reaction = async (req: Request, res: Response) => {
    try {
        // Convertir la Map en tableau
        const reactionsArray = Array.from(reactionsMap.values());

        res.status(200).json({ reactions: reactionsArray });
    } catch (error) {
        console.error('Error fetching reactions:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
