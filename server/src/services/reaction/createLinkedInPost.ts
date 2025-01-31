import axios from 'axios';
import userModel from '../../db/userModel';

export const createLinkedInPost = async (email: string, postContent: string) => {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error(`Utilisateur avec l'email "${email}" non trouvé.`);
      }
  
      const apiKeysMap = user.apiKeys as Map<string, string>;
      const linkedInAccessToken = apiKeysMap.get('linkedin');
      const idServices = user.idService as Map<string, string>;
      const idLinkedin = idServices.get('linkedin');
      if (!linkedInAccessToken) {
        throw new Error(`Token LinkedIn manquant pour l'utilisateur "${email}".`);
      }

      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        {
          author: `urn:li:person:${idLinkedin}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: postContent,
              },
              shareMediaCategory: 'NONE',
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${linkedInAccessToken}`,
            'LinkedIn-Version': '202401',
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('🚀 Post LinkedIn créé avec succès:', response.data);
      return {
        message: '🔗 Post LinkedIn créé avec succès.',
        postId: response.data.id,
      };
    } catch (error) {
      console.error('❌ Erreur dans createLinkedInPost:', error);
      throw new Error('Impossible de créer le post LinkedIn.');
    }
  };