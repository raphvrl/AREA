import axios from 'axios';
import userModel from '../../db/userModel';
import dotenv from 'dotenv';

dotenv.config();

interface NotionResponse {
  message: string;
  pageUrl?: string;
}

const createdPages = new Set<string>();
let lastPageCreationTime = 0;
const CREATION_COOLDOWN = 5000;
let isCreatingPage = false;

export const createPage_notion = async (
  email: string,
  option: string,
  actionResult?: any
): Promise<NotionResponse | null> => {
  try {
    if (isCreatingPage) {
      console.log('⚠️ Création de page déjà en cours');
      return null;
    }

    const currentTime = Date.now();
    if (currentTime - lastPageCreationTime < CREATION_COOLDOWN) {
      console.log('⏳ Délai minimum non respecté:', currentTime - lastPageCreationTime);
      return null;
    }

    if (createdPages.has(option)) {
      console.log('🚫 Page déjà créée:', option);
      return null;
    }

    isCreatingPage = true;

    console.log('📝 Tentative de création de page Notion:', option);
    const user = await userModel.findOne({ email });

    if (!user) {
      isCreatingPage = false;
      throw new Error(`Utilisateur avec l'email "${email}" non trouvé`);
    }

    const apiKeysMap = user.apiKeys as Map<string, string>;
    const notionToken = apiKeysMap.get('notion');

    if (!notionToken) {
      isCreatingPage = false;
      throw new Error('Token Notion manquant');
    }

    // Extraire le titre et l'ID de la page parent de l'option
    const [parentPageId, pageTitle] = option.split('|');

    if (!parentPageId || !pageTitle) {
      isCreatingPage = false;
      throw new Error('Format d\'option invalide. Attendu: "ID_PAGE_PARENT|TITRE_PAGE"');
    }

    const response = await axios.post(
      'https://api.notion.com/v1/pages',
      {
        parent: { page_id: parentPageId },
        properties: {
          title: {
            type: 'title',
            title: [
              {
                type: 'text',
                text: { content: pageTitle }
              }
            ]
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        }
      }
    );

    createdPages.add(option);
    lastPageCreationTime = currentTime;
    isCreatingPage = false;

    console.log('✅ Page créée avec succès:', response.data.url);
    return {
      message: `📝 Nouvelle page Notion créée !\nTitre: ${pageTitle}\nURL: ${response.data.url}`,
      pageUrl: response.data.url
    };

  } catch (error) {
    isCreatingPage = false;
    console.error('❌ Erreur dans createPage_notion:', error);
    if (axios.isAxiosError(error)) {
      console.error("Détails de l'erreur:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    throw error;
  }
};