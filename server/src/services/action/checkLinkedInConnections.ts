import axios from 'axios';
import userModel from '../../db/userModel';

const getLinkedInUserId = async (accessToken: string) => {
    try {
      const response = await axios.get('https://api.linkedin.com/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'LinkedIn-Version': '202401',
        },
      });
  
      return response.data.id; // Récupérer l'ID de l'utilisateur
    } catch (error) {
      console.error('Erreur lors de la récupération du profil LinkedIn:', error);
      throw new Error('Impossible de récupérer l\'ID LinkedIn.');
    }
  };

  const getLinkedInFollowers = async (accessToken: string, userId: string) => {
    try {
      const response = await axios.get(
        `https://api.linkedin.com/v2/networkSizes/urn:li:person:${userId}?edgeType=CompanyFollowedByMember`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'LinkedIn-Version': '202401',
          },
        }
      );
  
      return response.data.firstDegreeSize; // Nombre de followers
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnés LinkedIn:', error);
      throw new Error('Impossible de récupérer les abonnés LinkedIn.');
    }
  };

interface LinkedInConnection {
  id: string;
  localizedFirstName: string;
  localizedLastName: string;
  profilePicture?: string;
}

let lastConnections: string[] = [];

export const checkLinkedInConnections = async (email: string) => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error(`Utilisateur avec l'email "${email}" non trouvé.`);
    }

    const apiKeysMap = user.apiKeys as Map<string, string>;
    const linkedInAccessToken = apiKeysMap.get('linkedin');

    if (!linkedInAccessToken) {
      throw new Error(`Token LinkedIn manquant pour l'utilisateur "${email}".`);
    }
    const response = await axios.get('https://api.linkedin.com/v2/connections', {
      headers: {
        Authorization: `Bearer ${linkedInAccessToken}`,
        'LinkedIn-Version': '202401',
      },
    });

    if (!response.data || !response.data.elements) {
      console.log('Aucune connexion trouvée.');
      return null;
    }

    const connections: LinkedInConnection[] = response.data.elements.map((conn: any) => ({
      id: conn.id,
      localizedFirstName: conn.localizedFirstName,
      localizedLastName: conn.localizedLastName,
      profilePicture: conn.profilePicture?.['displayImage~']?.elements[0]?.identifiers[0]?.identifier,
    }));
    const newConnections = connections.filter(conn => !lastConnections.includes(conn.id));
    lastConnections = connections.map(conn => conn.id);
    if (newConnections.length > 0) {
      console.log('🚀 Nouvelles connexions détectées sur LinkedIn:', newConnections);
      return {
        message: `🔗 Nouveaux abonnés LinkedIn détectés:\n${newConnections
          .map(conn => `${conn.localizedFirstName} ${conn.localizedLastName}`)
          .join(', ')}`,
        connections: newConnections,
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Erreur dans checkLinkedInConnections:', error);
    throw new Error('Impossible de récupérer les connexions LinkedIn.');
  }
};
