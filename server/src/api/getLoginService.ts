import UserModel from '../db/UserModel';

async function getLoginService(email: string) {
    try {
        // Récupérer l'utilisateur par email
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        // Filtrer les services qui sont définis à true
        const activeServices = Object.keys(user.service || {}).filter(serviceName => user.service[serviceName] === true);

        return activeServices;
    } catch (error) {
        throw new Error('Error fetching login services: ' + error.message);
    }
}
