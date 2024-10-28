const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"

const SCOPES = [
	"user-top-read",
	"user-read-private",
	"user-read-email",
	"playlist-read-private",
	"user-read-recently-played",
	"user-read-playback-state",
	"user-read-currently-playing",
].join("%20")

const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`

export { loginUrl, CLIENT_ID, CLIENT_SECRET }
