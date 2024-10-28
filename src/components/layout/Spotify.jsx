import { useSpotifyData } from "./script"

function SpotifyComponent() {
	// Contoh mengambil playlist
	const { data, loading, error } = useSpotifyData(
		"playlists/37i9dQZF1DXcBWIGoYBM5M"
	)

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error: {error}</div>

	return (
		<div>
			{/* Tampilkan data sesuai kebutuhan */}
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	)
}
