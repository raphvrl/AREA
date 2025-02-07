import UserModel from '../../db/userModel';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: `http://localhost:${process.env.BACKEND_PORT}/api/auth/spotify/callback`
});

interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string;
    images: Array<{ url: string }>;
    external_urls: { spotify: string };
}

interface PlaylistResult {
    message: string;
    name?: string;
    imageUrl?: string;
}

let lastKnownPlaylistId: string | null = null;
let isInitialized = false;

export const playlistCreated_spotify = async (email: string): Promise<PlaylistResult | null> => {
    try {
        console.log('🎵 Vérification des nouvelles playlists Spotify pour:', email);
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`Utilisateur avec l'email "${email}" non trouvé`);
        }

        const apiKeysMap = user.apiKeys as Map<string, string>;
        const spotifyAccessToken = apiKeysMap.get('spotify');

        if (!spotifyAccessToken) {
            throw new Error(`Token Spotify manquant pour l'utilisateur "${email}"`);
        }

        spotifyApi.setAccessToken(spotifyAccessToken);

        // Récupérer les playlists de l'utilisateur
        const playlists = await spotifyApi.getUserPlaylists();
        if (!playlists.body.items.length) {
            console.log('❌ Aucune playlist trouvée');
            return null;
        }

        const latestPlaylist = playlists.body.items[0] as SpotifyPlaylist;
        
        // Vérification de sécurité pour latestPlaylist
        if (!latestPlaylist) {
            console.log('⚠️ Playlist la plus récente non disponible');
            return null;
        }

        // Première exécution : initialisation
        if (!isInitialized) {
            lastKnownPlaylistId = latestPlaylist.id;
            isInitialized = true;
            console.log('🚀 Initialisation: sauvegarde des playlists existantes');
            return null;
        }

        // Vérifier si c'est une nouvelle playlist
        if (latestPlaylist.id !== lastKnownPlaylistId) {
            lastKnownPlaylistId = latestPlaylist.id;
            console.log('✨ Nouvelle playlist détectée:', {
                name: latestPlaylist.name,
                id: latestPlaylist.id
            });

            // Récupération sécurisée de l'URL de l'image
            const imageUrl = latestPlaylist.images && 
                           latestPlaylist.images.length > 0 ? 
                           latestPlaylist.images[0].url : 
                           undefined;

            return {
                message: `🎵 Nouvelle playlist Spotify créée:\nNom: ${latestPlaylist.name}\nURL: ${latestPlaylist.external_urls.spotify}`,
                name: latestPlaylist.name,
                imageUrl: imageUrl
            };
        }

        console.log('😴 Aucune nouvelle playlist détectée');
        return null;

    } catch (error) {
        console.error('❌ Erreur dans playlistCreated_spotify:', error);
        if (error instanceof Error) {
            throw new Error(`Erreur lors de la vérification des playlists: ${error.message}`);
        }
        throw new Error('Une erreur inconnue est survenue');
    }
};