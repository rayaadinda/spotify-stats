"use client"

import "./App.css"
import SpotifyTopTracks from "./components/SpotifyTopTracks"
import Footer from "./components/Footer"

function App() {
	return (
		<div className="container mx-auto py-8">
			<SpotifyTopTracks />
			<Footer />
		</div>
	)
}

export default App
