import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const analyzeListeningTime = (recentlyPlayed) => {
	if (!recentlyPlayed || recentlyPlayed.length === 0) {
		console.log("No recently played data available")
		return {}
	}

	const timeByDay = {}
	recentlyPlayed.forEach((item) => {
		if (item && item.played_at && item.track) {
			const date = new Date(item.played_at).toLocaleDateString()
			timeByDay[date] = (timeByDay[date] || 0) + item.track.duration_ms
		}
	})

	// Convert milliseconds to minutes and round to 2 decimal places
	Object.keys(timeByDay).forEach((date) => {
		timeByDay[date] = Math.round((timeByDay[date] / 60000) * 100) / 100
	})
	return timeByDay
}

function StatCard({ title, value, subtitle }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				{subtitle && (
					<p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
				)}
			</CardContent>
		</Card>
	)
}

function SpotifyStats({
	timeStats,
	recentlyPlayed,
	longTermTopArtists,
	shortTermTracks,
	mediumTermTracks,
	longTermTracks,
}) {
	const listeningTimeByDay = analyzeListeningTime(recentlyPlayed)
	const today = new Date().toLocaleDateString()
	const todayListening = listeningTimeByDay[today] || 0

	// Get the most played artist from long term data
	const topLongTermArtist = longTermTopArtists?.[0]

	// Hitung total durasi dari semua time range
	const calculateTotalMinutes = () => {
		const allTracks = [
			...shortTermTracks,
			...mediumTermTracks,
			...longTermTracks,
		]

		// Filter lagu-lagu unik berdasarkan ID
		const uniqueTracks = Array.from(
			new Set(allTracks.map((track) => track.id))
		).map((id) => allTracks.find((track) => track.id === id))

		// Hitung total durasi untuk lagu-lagu dari artis teratas
		const totalMinutes = uniqueTracks.reduce((total, track) => {
			if (
				track.artists.some((artist) => artist.name === topLongTermArtist?.name)
			) {
				// Multiply by estimated play count based on time range
				const playCount = 20 // Estimasi rata-rata pemutaran
				return total + (track.duration_ms / 60000) * playCount
			}
			return total
		}, 0)

		return Math.round(totalMinutes)
	}

	const totalMinutesPlayed = calculateTotalMinutes()

	return (
		<div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
			<StatCard
				title="Total Listening Time"
				value={`${timeStats.totalMinutes} mins`}
				subtitle="In the last 50 tracks"
			/>
			<StatCard
				title="Today's Listening Time"
				value={`${todayListening} mins`}
				subtitle="Minutes listened today"
			/>
			<StatCard
				title="Unique Tracks"
				value={timeStats.uniqueTracks}
				subtitle="Different songs played"
			/>
			<StatCard
				title="All-Time Top Artist"
				value={topLongTermArtist?.name || "N/A"}
				subtitle={`${totalMinutesPlayed} minutes played`}
			/>

			<div className="col-span-full">
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Last 7 Days Listening Time
						</CardTitle>
					</CardHeader>
					<CardContent>
						{Object.keys(listeningTimeByDay).length === 0 ? (
							<div className="text-center py-4 text-muted-foreground">
								No listening data available for the last 7 days
							</div>
						) : (
							<div className="space-y-2">
								{Object.entries(listeningTimeByDay)
									.slice(-7)
									.map(([date, minutes]) => (
										<div
											key={date}
											className="flex justify-between items-center"
										>
											<span className="text-sm text-muted-foreground">
												{date}
											</span>
											<span className="font-medium">{minutes} mins</span>
										</div>
									))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default SpotifyStats
