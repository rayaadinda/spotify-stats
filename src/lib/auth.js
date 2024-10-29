import { SPOTIFY_CONFIG } from "./config"

const SCOPES = SPOTIFY_CONFIG.scopes.join(" ")

export const getAuthUrl = () => {
	const params = new URLSearchParams({
		client_id: SPOTIFY_CONFIG.clientId,
		redirect_uri: SPOTIFY_CONFIG.redirectUri,
		scope: SCOPES,
		response_type: "token",
		show_dialog: "true",
	})

	return `${SPOTIFY_CONFIG.authEndpoint}?${params.toString()}`
}

export const handleSpotifyLogin = () => {
	window.location.href = getAuthUrl()
}

export const getTokenFromUrl = () => {
	if (!window.location.hash) return null

	const params = new URLSearchParams(window.location.hash.substring(1))
	return params.get("access_token")
}

export const clearAuth = () => {
	localStorage.removeItem("spotify_token")
	localStorage.removeItem("token_timestamp")
}

export const setToken = (token) => {
	localStorage.setItem("spotify_token", token)
	localStorage.setItem("token_timestamp", Date.now())
}

export const getStoredToken = () => {
	const token = localStorage.getItem("spotify_token")
	const timestamp = localStorage.getItem("token_timestamp")

	if (!token || !timestamp) return null

	// Token expires after 1 hour
	if (Date.now() - Number(timestamp) > 3600000) {
		clearAuth()
		return null
	}

	return token
}
