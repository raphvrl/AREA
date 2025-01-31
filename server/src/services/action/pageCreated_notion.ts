import axios from 'axios';
import userModel from '../../db/userModel';

interface NotionPage {
    id: string;
    properties: {
        title: {
            title: Array<{
                plain_text: string;
                text: {
                    content: string;
                };
            }>;
        };
    };
    url: string;
    created_time: string;
}

interface NotionResult {
    message: string;
    name: string;
}

let knownPages: Set<string> = new Set();
let isInitialized = false;

export const pageCreated_notion = async (email: string): Promise<NotionResult | null> => {
    try {
        console.log('📝 Vérification des nouvelles pages Notion pour:', email);
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        const apiKeysMap = user.apiKeys as Map<string, string>;
        const notionToken = apiKeysMap.get('notion');

        if (!notionToken) {
            throw new Error(`Notion token missing for user "${email}".`);
        }

        console.log('🔍 Requête API Notion en cours...');
        const response = await axios.post('https://api.notion.com/v1/search',
            {
                filter: {
                    property: 'object',
                    value: 'page'
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${notionToken}`,
                    'Notion-Version': '2022-02-22',
                    'Content-Type': 'application/json'
                }
            }
        );

        const pages = response.data.results;
        console.log('📊 Statistiques actuelles:', {
            totalPages: pages.length,
            knownPagesCount: knownPages.size,
            isFirstRun: !isInitialized
        });

        // Log des 5 dernières pages
        console.log('📑 5 dernières pages:');
        pages.slice(0, 5).forEach((page: NotionPage, index: number) => {
            const pageTitle = page.properties.title.title[0]?.plain_text || 'Sans titre';
            console.log(`${index + 1}. Title: ${pageTitle}, ID: ${page.id}`);
        });

        if (!isInitialized) {
            pages.forEach((page: NotionPage) => {
                knownPages.add(page.id);
            });
            isInitialized = true;
            console.log('🚀 Première exécution - Initialisation avec:', {
                pagesCount: knownPages.size,
                pagesList: Array.from(knownPages).slice(0, 3)
            });
            return null;
        }

        // Chercher les nouvelles pages
        for (const page of pages) {
            if (!knownPages.has(page.id)) {
                knownPages.add(page.id);
                const pageTitle = page.properties.title.title[0]?.plain_text || 'Sans titre';
                console.log('✨ Nouvelle page détectée !', {
                    title: pageTitle,
                    id: page.id,
                    url: page.url,
                    created: page.created_time
                });

                return {
                    message: `📝 Nouvelle page Notion créée:\nTitre: ${pageTitle}\nURL: ${page.url}`,
                    name: pageTitle
                };
            }
        }

        console.log('😴 Aucune nouvelle page détectée');
        return null;

    } catch (error) {
        console.error('❌ Erreur dans pageCreated_notion:', {
            type: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : 'Erreur inconnue',
            stack: error instanceof Error ? error.stack : undefined
        });
        
        if (error instanceof Error) {
            throw new Error(`Erreur lors de la vérification des pages Notion: ${error.message}`);
        } else {
            throw new Error('Une erreur inconnue est survenue');
        }
    }
};