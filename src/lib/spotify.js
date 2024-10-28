const CLIENT_ID = "978f14e340ac4bc3b3990dbaca5ce586"
const CLIENT_SECRET = "2c97f3f438e14252aa4354ed918780a8"
const REDIRECT_URI = "http://localhost:5173/callback"
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
