import { SPOTIFY_CLIENT_ID, REDIRECT_URI } from "./config"

const SCOPES = [
	"user-top-read",
	"user-read-private",
	"user-read-email",
	"playlist-read-private",
	"user-read-recently-played",
	"user-read-playback-state",
	"user-read-currently-playing",
].join("%20")

export const loginUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`

export const handleSpotifyLogin = () => {
	window.location.href = loginUrl
}

export const getTokenFromUrl = () => {
	return window.location.hash
		.substring(1)
		.split("&")
		.reduce((initial, item) => {
			let parts = item.split("=")
			initial[parts[0]] = decodeURIComponent(parts[1])
			return initial
		}, {})
}
