import UserModel from '../db/UserModel';

async function delete_area(nom_area: string, email: string) {
    try {
        // Récupérer l'utilisateur par email
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        // Forcer TypeScript à comprendre les types de `area`
        const areaMap = user.area as Map<string, { action: string; reaction: string; is_on: string }>;

        // Vérifier si l'area existe
        if (!areaMap.has(nom_area)) {
            throw new Error(`Area "${nom_area}" not found.`);
        }

        // Supprimer l'area
        areaMap.delete(nom_area);

        // Enregistrer les modifications dans la base de données
        await user.save();

        return { message: `Area "${nom_area}" has been successfully deleted.` };
    } catch (error) {
        console.error('Error in delete_area:', error);
        throw new Error('Internal server error.');
    }
}
