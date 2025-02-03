export const playTrack = async (token: string) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: ['spotify:track:votre_track_id'],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to play track');
    }

    return await response.json();
  } catch (error) {
    console.error('Error playing track:', error);
    throw error;
  }
};
