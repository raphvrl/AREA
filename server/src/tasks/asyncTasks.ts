import UserModel from '../db/UserModel'; // Assurez-vous que le chemin est correct
import areaHandlers from '../services/areaHandlers'; // Import des handlers

export const executeAreas = async () => {
    try {
        // Récupérer tous les utilisateurs dans la base de données
        const users = await UserModel.find().lean();

        const promises = users.map(async (user) => {
            const areaPromises = [];

            // S'assurer que `user.area` est un `Map<string, { action: string; reaction: string; is_on: string }>`
            const areas = user.area as Map<string, { action: string; reaction: string; is_on: string }>;

            // Parcourir chaque "area" de l'utilisateur
            for (const [key, area] of areas.entries()) {
                if (area.is_on === "true") {
                    console.log(`Executing area "${key}" for user "${user.firstName} ${user.lastName}"`);

                    const actionFunction = areaHandlers[area.action];
                    const reactionFunction = areaHandlers[area.reaction];

                    if (actionFunction && reactionFunction) {
                        // Ajouter une promesse pour chaque action-réaction
                        areaPromises.push(
                            (async () => {
                                try {
                                    // Exécuter l'action
                                    console.log(user.email)
                                    const actionResult = await actionFunction(user.email);
                                    if (actionResult != null) {
                                        const reactionResult = await reactionFunction(user.email, actionResult);
                                        console.log(`Action "${area.action}" completed with result:`, actionResult);
                                        console.log(`Reaction "${area.reaction}" completed with result:`, reactionResult);
                                    }
                                } catch (error) {
                                    console.error(
                                        `Error executing area "${key}" for user "${user.firstName} ${user.lastName}":`,
                                        error
                                    );
                                }
                            })()
                        );
                    } else {
                        console.warn(
                            `Action "${area.action}" or Reaction "${area.reaction}" not implemented for area "${key}"`,
                        );
                    }
                }
            }

            // Attendre que toutes les actions et réactions de l'utilisateur soient terminées
            await Promise.all(areaPromises);
        });

        // Attendre que tous les utilisateurs soient traités
        await Promise.all(promises);
    } catch (error) {
        console.error("Error executing areas:", error);
    }
};
