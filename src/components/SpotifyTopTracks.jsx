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

	if (!token) {
		return <LoginPage onLogin={handleSpotifyLogin} />
	}

	return (
		<div className="space-y-4 px-4 sm:px-0">
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
										<div
											key={track.id}
											className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors border"
										>
											<span className="text-muted-foreground w-5 text-sm">
												{index + 1}
											</span>
											<img
												src={track.album.images[2]?.url}
												alt={track.name}
												className="w-10 h-10 object-cover rounded"
											/>
											<div className="flex-grow min-w-0">
												<h3 className="flex items-start font-medium text-sm truncate">
													{track.name}
												</h3>
												<p className="flex items-start text-xs text-muted-foreground truncate">
													{track.artists
														.map((artist) => artist.name)
														.join(", ")}
												</p>
											</div>
										</div>
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
				<TabsContent value="export">
					<div className="space-y-4">
						<h2 className="text-xl sm:text-2xl font-bold">Recap Stats</h2>
						<div className="flex justify-center items-center">
							<div
								ref={exportRef}
								className="p-2 flex justify-center items-center"
							>
								<MonthlyRecap
									timeStats={timeStats}
									topTracks={shortTermTracks}
									topArtists={shortTermTopArtists}
									topGenres={topGenres}
								/>
							</div>
						</div>
						<div className="max-w-md mx-auto">
							<Button
								onClick={() =>
									exportAsImage(exportRef.current, "spotify-monthly-recap")
								}
								className="w-full mt-4"
							>
								Export as Image
							</Button>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default SpotifyTopTracks
