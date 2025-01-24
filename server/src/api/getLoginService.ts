import UserModel from '../db/UserModel';

async function getLoginService(email: string) {
    try {
        // Récupérer l'utilisateur par email
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        // Filtrer les services qui sont définis à true
        const services = Object.entries(user.services || {}).filter(([serviceName, serviceStatus]) => serviceStatus === true);

        // Transformer en un objet avec les services activés
        const activeServices = services.reduce((acc, [serviceName]) => {
            acc[serviceName] = true;
            return acc;
        }, {});

        return activeServices;
    } catch (error) {
        throw new Error('Error fetching login services: ' + error.message);
    }
}
