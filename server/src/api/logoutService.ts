import UserModel from '../db/UserModel';

async function logout_service(name_service: string, email: string) {
    try {
        // Récupérer l'utilisateur par email
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        // Vérifier si le service existe
        if (!user.services || !user.services[name_service]) {
            throw new Error(`Service "${name_service}" not found for user "${email}".`);
        }

        // Déconnecter le service
        delete user.services[name_service];

        // Enregistrer les modifications dans la base de données
        await user.save();

        return { message: `Service "${name_service}" has been successfully logged out.` };
    } catch (error) {
        console.error('Error in logout_service:', error);
        throw new Error('Internal server error.');
    }
}
