import SpotifyWebApi from 'spotify-web-api-node';
import UserModel from '../../db/userModel';

interface LikedTrackResult {
    message: string;
    name: string;
    artist: string;
}

let lastKnownTrackId: string | null = null;
let isInitialized = false;

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: `http://localhost:${process.env.BACKEND_PORT}/api/auth/spotify/callback`
});

export const trackLiked_spotify = async (email: string): Promise<LikedTrackResult | null> => {
    try {
        console.log('Checking for new liked tracks for user:', email);
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        const apiKeysMap = user.apiKeys as Map<string, string>;
        const spotifyToken = apiKeysMap.get('spotify');

        if (!spotifyToken) {
            throw new Error(`Spotify token missing for user "${email}".`);
        }

        spotifyApi.setAccessToken(spotifyToken);

        // Récupérer les musiques likées
        const response = await spotifyApi.getMySavedTracks({ limit: 1 });
        if (!response.body.items.length) {
            console.log('No liked tracks found');
            return null;
        }

        const latestTrack = response.body.items[0].track;
        console.log('Latest liked track:', {
            name: latestTrack.name,
            artist: latestTrack.artists[0].name,
            id: latestTrack.id
        });

        if (!isInitialized) {
            lastKnownTrackId = latestTrack.id;
            isInitialized = true;
            console.log('First run - Initialized with track:', {
                id: lastKnownTrackId,
                name: latestTrack.name
            });
            return null;
        }

        if (latestTrack.id !== lastKnownTrackId) {
            lastKnownTrackId = latestTrack.id;
            console.log('New liked track detected!', {
                name: latestTrack.name,
                artist: latestTrack.artists[0].name
            });

            return {
                message: `💚 Nouvelle musique likée sur Spotify:\nTitre: ${latestTrack.name}\nArtiste: ${latestTrack.artists[0].name}`,
                name: latestTrack.name,
                artist: latestTrack.artists[0].name
            };
        }

        console.log('No new liked tracks detected');
        return null;

    } catch (error) {
        console.error('Error in trackLiked_spotify:', error);
        if (error instanceof Error) {
            throw new Error(`Erreur lors de la vérification des musiques likées: ${error.message}`);
        } else {
            throw new Error('Erreur inconnue lors de la vérification des musiques likées');
        }
    }
};