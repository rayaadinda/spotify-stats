import { useState, useEffect } from "react"
import {
	getTokenFromUrl,
	setToken,
	getStoredToken,
	clearAuth,
	getAuthUrl,
} from "../lib/auth"

export const useSpotify = () => {
	const [token, setTokenState] = useState(getStoredToken())
	const [profile, setProfile] = useState(null)
	const [topTracks, setTopTracks] = useState([])
	const [topGenres, setTopGenres] = useState([])
	const [playlists, setPlaylists] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [recentlyPlayed, setRecentlyPlayed] = useState([])
	const [timeStats, setTimeStats] = useState(null)
	const [longTermTopArtists, setLongTermTopArtists] = useState([])
	const [longTermTopTracks, setLongTermTopTracks] = useState([])
	const [shortTermTracks, setShortTermTracks] = useState([])
	const [mediumTermTracks, setMediumTermTracks] = useState([])
	const [longTermTracks, setLongTermTracks] = useState([])
	const [shortTermTopArtists, setShortTermTopArtists] = useState([])

	useEffect(() => {
		const urlToken = getTokenFromUrl()
		if (urlToken) {
			setToken(urlToken)
			setTokenState(urlToken)
			window.location.hash = ""
			return
		}

		const storedToken = getStoredToken()
		if (storedToken) {
			setTokenState(storedToken)
		}
	}, [])

	const getProfile = async () => {
		try {
			const response = await fetch("https://api.spotify.com/v1/me", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				throw new Error("Failed to fetch profile")
			}

			const data = await response.json()
			setProfile(data)
			setLoading(false)
		} catch (err) {
			setError(err.message)
			setLoading(false)
		}
	}

	const getTopTracks = async () => {
		try {
			const response = await fetch(
				"https://api.spotify.com/v1/me/top/tracks?offset=0&limit=30&time_range=short_term",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			if (!response.ok) {
				throw new Error("Failed to fetch top tracks")
			}

			const data = await response.json()
			setTopTracks(data.items)
			setLoading(false)
		} catch (err) {
			setError(err.message)
			setLoading(false)
		}
	}

	const getTopArtistsGenres = async () => {
		try {
			const response = await fetch(
				"https://api.spotify.com/v1/me/top/artists?time_range=long_term",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			if (!response.ok) {
				throw new Error("Failed to fetch top artists")
			}

			const data = await response.json()

			// Mengumpulkan semua genre dan menghitung frekuensinya
			const genreCounts = data.items.reduce((acc, artist) => {
				artist.genres.forEach((genre) => {
					acc[genre] = (acc[genre] || 0) + 1
				})
				return acc
			}, {})

			// Mengurutkan genre berdasarkan frekuensi
			const sortedGenres = Object.entries(genreCounts)
				.sort(([, a], [, b]) => b - a)
				.map(([genre]) => genre)
				.slice(0, 5) // Mengambil 5 genre teratas

			setTopGenres(sortedGenres)
		} catch (err) {
			console.error("Error fetching top artists:", err)
		}
	}

	const getUserPlaylists = async () => {
		try {
			const response = await fetch("https://api.spotify.com/v1/me/playlists", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				throw new Error("Failed to fetch playlists")
			}

			const data = await response.json()
			setPlaylists(data.items)
		} catch (err) {
			console.error("Error fetching playlists:", err)
		}
	}

	const getRecentlyPlayed = async () => {
		try {
			const response = await fetch(
				"https://api.spotify.com/v1/me/player/recently-played?limit=50",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			if (!response.ok) {
				if (response.status === 403) {
					console.log("Need to re-authenticate with proper scopes")
					// Optional: Bisa trigger logout otomatis
					// logout()
					return
				}
				throw new Error("Failed to fetch recently played")
			}

			const data = await response.json()
			setRecentlyPlayed(data.items)
			calculateTimeStats(data.items)
		} catch (err) {
			console.error("Error fetching recently played:", err)
			setTimeStats({
				totalMinutes: 0,
				uniqueTracks: 0,
				topArtists: [],
			})
		}
	}

	const calculateTimeStats = (tracks) => {
		const stats = {
			totalMinutes: 0,
			topArtists: {},
			mostPlayedTrack: { name: "", count: 0 },
			uniqueTracks: new Set(),
		}

		tracks.forEach((item) => {
			// Hitung total menit
			stats.totalMinutes += Math.floor(item.track.duration_ms / 60000)

			// Hitung artis yang sering didengar
			item.track.artists.forEach((artist) => {
				stats.topArtists[artist.name] = (stats.topArtists[artist.name] || 0) + 1
			})

			// Track unik
			stats.uniqueTracks.add(item.track.id)
		})

		setTimeStats({
			totalMinutes: stats.totalMinutes,
			uniqueTracks: stats.uniqueTracks.size,
			topArtists: Object.entries(stats.topArtists)
				.sort(([, a], [, b]) => b - a)
				.slice(0, 5),
		})
	}

	const getLongTermTopArtists = async () => {
		try {
			const response = await fetch(
				"https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			if (!response.ok) {
				throw new Error("Failed to fetch long term top artists")
			}

			const data = await response.json()
			setLongTermTopArtists(data.items)
		} catch (err) {
			console.error("Error fetching long term top artists:", err)
		}
	}

	const getLongTermTopTracks = async () => {
		try {
			const response = await fetch(
				"https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			if (!response.ok) {
				throw new Error("Failed to fetch long term top tracks")
			}

			const data = await response.json()
			setLongTermTopTracks(data.items)
		} catch (err) {
			console.error("Error fetching long term top tracks:", err)
		}
	}

	const getAllTimeRangeTracks = async () => {
		try {
			const timeRanges = ["short_term", "medium_term", "long_term"]
			const responses = await Promise.all(
				timeRanges.map((range) =>
					fetch(
						`https://api.spotify.com/v1/me/top/tracks?time_range=${range}&limit=50`,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					)
				)
			)

			const data = await Promise.all(responses.map((res) => res.json()))

			setShortTermTracks(data[0].items)
			setMediumTermTracks(data[1].items)
			setLongTermTracks(data[2].items)
		} catch (err) {
			console.error("Error fetching tracks:", err)
		}
	}

	const getShortTermTopArtists = async () => {
		try {
			const response = await fetch(
				"https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			if (!response.ok) {
				throw new Error("Failed to fetch short term top artists")
			}

			const data = await response.json()
			setShortTermTopArtists(data.items)
		} catch (err) {
			console.error("Error fetching short term top artists:", err)
		}
	}

	useEffect(() => {
		if (token) {
			getProfile()
			getTopTracks()
			getTopArtistsGenres()
			getUserPlaylists()
			getRecentlyPlayed()
			getLongTermTopArtists()
			getLongTermTopTracks()
			getAllTimeRangeTracks()
			getShortTermTopArtists()
		}
	}, [token])

	const logout = () => {
		clearAuth()
		setTokenState(null)
		window.location.href = getAuthUrl()
	}

	return {
		token,
		profile,
		topTracks,
		topGenres,
		playlists,
		recentlyPlayed,
		timeStats,
		loading,
		error,
		logout,
		longTermTopArtists,
		longTermTopTracks,
		shortTermTracks,
		mediumTermTracks,
		longTermTracks,
		shortTermTopArtists,
	}
}
