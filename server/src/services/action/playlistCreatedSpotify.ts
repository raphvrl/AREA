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
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        const apiKeysMap = user.apiKeys as Map<string, string>;
        const spotifyAccessToken = apiKeysMap.get('spotify');

        if (!spotifyAccessToken) {
            throw new Error(`Spotify token missing for user "${email}".`);
        }

        spotifyApi.setAccessToken(spotifyAccessToken);

        // Récupérer les playlists de l'utilisateur
        const playlists = await spotifyApi.getUserPlaylists();
        if (!playlists.body.items.length) {
            return null;
        }

        const latestPlaylist = playlists.body.items[0] as SpotifyPlaylist;

        // Première exécution : initialisation
        if (!isInitialized) {
            lastKnownPlaylistId = latestPlaylist.id;
            isInitialized = true;
            console.log('Initialisation: sauvegarde des playlists existantes');
            return null;
        }

        // Vérifier si c'est une nouvelle playlist
        if (latestPlaylist.id !== lastKnownPlaylistId) {
            lastKnownPlaylistId = latestPlaylist.id;
            console.log('Nouvelle playlist détectée:', {
                name: latestPlaylist.name,
                id: latestPlaylist.id
            });

            return {
                message: `🎵 Nouvelle playlist Spotify créée:\nNom: ${latestPlaylist.name}\nURL: ${latestPlaylist.external_urls.spotify}`,
                name: latestPlaylist.name,
                imageUrl: latestPlaylist.images[0]?.url
            };
        }

        return null;

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in playlistCreated_spotify:', error.message);
            throw new Error(error.message);
        } else {
            console.error('An unknown error occurred');
            throw new Error('An unknown error occurred');
        }
    }
};