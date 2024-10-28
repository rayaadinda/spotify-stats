import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

function PlaylistSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-[300px]" />
			</CardHeader>
			<CardContent>
				<Skeleton className="w-full h-48 rounded-md" />
				<Skeleton className="mt-2 h-4 w-2/3" />
			</CardContent>
		</Card>
	)
}

function UserPlaylists({ playlists, loading }) {
	return (
		<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
			{loading
				? [...Array(6)].map((_, index) => <PlaylistSkeleton key={index} />)
				: playlists.map((playlist) => (
						<Card key={playlist.id} className="flex flex-col h-full">
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl line-clamp-2">
									{playlist.name}
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-grow">
								<img
									src={playlist.images[0]?.url}
									alt={playlist.name}
									className="w-full aspect-square object-cover rounded-md"
								/>
								<p className="mt-2 text-sm text-gray-600 line-clamp-2">
									{playlist.tracks.total} tracks
								</p>
							</CardContent>
						</Card>
				  ))}
		</div>
	)
}

export default UserPlaylists
