import UserModel from '../../db/UserModel';

export const nomAction_nomSerice = async (
  email: string
): Promise<string | null> => {
  try {
    const serviceKey = 'X';
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error(`User with email "${email}" not found.`);
    }

    // Forcer TypeScript à comprendre que `service` est une Map
    const serviceMap = user.service as Map<string, string>;

    // Vérifier si le service demandé existe et retourner sa valeur
    const serviceValue = serviceMap.get(serviceKey);
    if (!serviceValue) {
      throw new Error(`Service "${serviceKey}" not found for user "${email}".`);
    }

    return serviceValue; // Retourner la valeur du service
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in test_fonction:', error.message);
      throw new Error(error.message); // Lever une erreur avec le message
    } else {
      console.error('An unknown error occurred.');
      throw new Error('An unknown error occurred.');
    }
  }
};
