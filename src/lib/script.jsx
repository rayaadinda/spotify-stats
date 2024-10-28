import { useState, useEffect } from "react"

const SPOTIFY_CLIENT_ID = "978f14e340ac4bc3b3990dbaca5ce586"
const SPOTIFY_CLIENT_SECRET = "2c97f3f438e14252aa4354ed918780a8"

export const getSpotifyToken = async () => {
	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
		},
		body: "grant_type=client_credentials",
	})

	const data = await response.json()
	return data.access_token
}

export const useSpotifyData = (endpoint) => {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = await getSpotifyToken()
				const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (!response.ok) {
					throw new Error("Failed to fetch data")
				}

				const result = await response.json()
				setData(result)
				setLoading(false)
			} catch (err) {
				setError(err.message)
				setLoading(false)
			}
		}

		fetchData()
	}, [endpoint])

	return { data, loading, error }
}
