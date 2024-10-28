import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { AudioWaveform } from "lucide-react"

function LoginPage({ onLogin }) {
	return (
		<div className="flex items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">
						Welcome to Spotify Stats
					</CardTitle>
					<CardDescription>
						View your top tracks, artists, and listening statistics
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex justify-center">
						{/* You can add your own logo or illustration here */}
						<div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
							<AudioWaveform className="w-16 h-16 text-primary" />
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
				<CardFooter>
					<Button className="w-full" size="lg" onClick={onLogin}>
						<AudioWaveform className="w-5 h-5 mr-2" />
						Login with Spotify
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}

export default LoginPage
