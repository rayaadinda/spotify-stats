import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import logospo from "@/assets/Primary_Logo.svg"

function LoginPage({ onLogin }) {
	const handleGetSpotify = () => {
		window.open("https://www.spotify.com/signup", "_blank")
	}

	return (
		<div className="flex items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Musc Verse</CardTitle>
					<CardDescription>
						View your top tracks, artists, and listening statistics
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex justify-center">
						<div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
							<img src={logospo} alt="Spotify Logo" className="w-28 h-28" />
						</div>
					</div>
					<div className="space-y-2 text-center">
						<h3 className="font-medium">Features:</h3>
						<ul className="text-sm text-muted-foreground">
							<li>• View your top tracks and artists</li>
							<li>• Track your listening time</li>
						</ul>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-2">
					<Button
						className="w-full bg-[#1ED760] hover:bg-[#1DB954]"
						size="lg"
						onClick={handleGetSpotify}
					>
						GET SPOTIFY FREE
					</Button>
					<Button
						className="w-full"
						variant="outline"
						size="lg"
						onClick={onLogin}
					>
						CONNECT WITH SPOTIFY
					</Button>
					<p className="text-xs text-center text-muted-foreground">
						Already have Spotify? Click above to connect
					</p>
				</CardFooter>
			</Card>
		</div>
	)
}

export default LoginPage
