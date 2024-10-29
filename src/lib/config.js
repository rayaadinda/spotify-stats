// Environment variables
export const SPOTIFY_CONFIG = {
	clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
	redirectUri: import.meta.env.VITE_REDIRECT_URI,
	authEndpoint: "https://accounts.spotify.com/authorize",
	scopes: [
		"user-top-read",
		"user-read-private",
		"user-read-email",
		"user-read-recently-played",
		"user-read-playback-state",
		"user-read-currently-playing",
	],
}
