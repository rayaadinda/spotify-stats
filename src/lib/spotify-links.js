export const getSpotifyUrl = (type, id) => {
	const baseUrl = "https://open.spotify.com"
	return `${baseUrl}/${type}/${id}`
}

export const openInSpotify = (url) => {
	window.open(url, "_blank")
}
