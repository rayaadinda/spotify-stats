import { useSpotify } from "../hooks/useSpotify"
import { handleSpotifyLogin } from "../lib/auth"
import LoginPage from "./auth/LoginPage"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import SpotifyStats from "./SpotifyStats"
import MonthlyRecap from "./export/MonthlyRecap"
import { useRef } from "react"
import { exportAsImage } from "../lib/exportImage"
import { Progress } from "./ui/progress"
import { useState } from "react"
import { getSpotifyUrl, openInSpotify } from "../lib/spotify-links"

console.log("Current environment:", import.meta.env.MODE)

function TrackSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{[...Array(6)].map((_, i) => (
				<div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
					<Skeleton className="h-5 w-5" />
					<Skeleton className="h-10 w-10 rounded" />
					<div className="flex-grow space-y-2">
						<Skeleton className="h-4 w-[120px]" />
						<Skeleton className="h-3 w-[90px]" />
					</div>
				</div>
			))}
		</div>
	)
}

function ProfileSkeleton() {
	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
			<Skeleton className="h-16 w-16 rounded-full" />
			<div className="space-y-2 w-full">
				<Skeleton className="h-6 w-[200px]" />
				<Skeleton className="h-4 w-[150px]" />
			</div>
		</div>
	)
}

function SpotifyTopTracks() {
	const {
		token,
		profile,
		topTracks,
		topGenres,
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
	} = useSpotify()

	const exportRef = useRef()
	const [exportProgress, setExportProgress] = useState(0)

	if (!token) {
		return <LoginPage onLogin={handleSpotifyLogin} />
	}

	const handleExport = async () => {
		try {
			await exportAsImage(
				exportRef.current,
				"spotify-monthly-recap",
				setExportProgress
			)
			// Wait a short moment before resetting
			setTimeout(() => {
				setExportProgress(0)
			}, 1000) // Reset after 1 second
		} catch (error) {
			console.error("Export failed:", error)
			setExportProgress(0)
		}
	}

	const TrackItem = ({ track, index }) => {
		return (
			<div
				className="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg transition-colors border cursor-pointer group"
				onClick={() => window.open(getSpotifyUrl("track", track.id), "_blank")}
			>
				<span className="text-muted-foreground w-5 text-sm">{index + 1}</span>
				<img
					src={track.album.images[1]?.url}
					alt={track.name}
					className="w-16 h-16 object-cover rounded"
				/>
				<div className="flex-grow min-w-0">
					<h3 className="flex items-start font-medium text-sm truncate">
						{track.name}
					</h3>
					<p className="flex items-start text-xs text-muted-foreground truncate">
						{track.artists.map((artist) => artist.name).join(", ")}
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 space-y-4">
			{loading ? (
				<ProfileSkeleton />
			) : (
				profile && (
					<div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
							{profile.images?.[0]?.url && (
								<img
									src={profile.images[0].url}
									alt={profile.display_name}
									className="h-16 w-16 rounded-full"
								/>
							)}
							<div className="flex flex-col gap-2 flex-grow">
								<h1 className="text-2xl flex items-start sm:text-xl text-gray-600">
									{profile.display_name}
								</h1>
								{topGenres.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{topGenres.map((genre) => (
											<span
												key={genre}
												className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
											>
												{genre}
											</span>
										))}
									</div>
								)}
							</div>
						</div>
						<Button
							onClick={logout}
							variant="outline"
							className="absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto"
						>
							Logout
						</Button>
					</div>
				)
			)}

			<Tabs defaultValue="top-tracks" className="w-full max-w-[800px] mx-auto">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="top-tracks">Top Tracks</TabsTrigger>
					<TabsTrigger value="stats">Stats</TabsTrigger>
					<TabsTrigger value="export">Recap</TabsTrigger>
				</TabsList>
				<TabsContent value="top-tracks">
					<div className="space-y-4">
						<h2 className="text-xl sm:text-2xl font-bold">Your Top Tracks</h2>
						<div className="">
							{loading ? (
								[...Array(30)].map((_, index) => <TrackSkeleton key={index} />)
							) : error ? (
								<div className="text-center text-red-500">Error: {error}</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{topTracks.map((track, index) => (
										<TrackItem key={track.id} track={track} index={index} />
									))}
								</div>
							)}
						</div>
					</div>
				</TabsContent>
				<TabsContent value="stats">
					<div className="space-y-4">
						<h2 className="text-xl sm:text-2xl font-bold">Your Statistics</h2>
						<SpotifyStats
							timeStats={timeStats}
							recentlyPlayed={recentlyPlayed}
							longTermTopArtists={longTermTopArtists}
							shortTermTracks={shortTermTracks}
							mediumTermTracks={mediumTermTracks}
							longTermTracks={longTermTracks}
						/>
					</div>
				</TabsContent>
				<TabsContent value="export" className="flex justify-center w-full">
					<div className="w-full max-w-[320px] flex flex-col items-center space-y-4">
						<h2 className="text-xl sm:text-2xl font-bold">Recap Stats</h2>

						{/* Recap card container */}
						<div ref={exportRef} className="w-full">
							<MonthlyRecap
								timeStats={timeStats}
								topTracks={shortTermTracks}
								topArtists={shortTermTopArtists}
								topGenres={topGenres}
							/>
						</div>

						{/* Export controls */}
						<div className="w-full space-y-4">
							{exportProgress > 0 && (
								<Progress value={exportProgress} className="w-full" />
							)}
							<Button
								onClick={handleExport}
								className="w-full"
								disabled={exportProgress > 0}
							>
								{exportProgress > 0 ? "Exporting..." : "Export as Image"}
							</Button>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default SpotifyTopTracks
