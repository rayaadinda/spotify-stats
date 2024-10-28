"use client"

import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SpotifyTopTracks from "./components/SpotifyTopTracks"
import Footer from "./components/Footer"

function App() {
	return (
		<Router>
			<div className="container mx-auto py-8">
				<Routes>
					<Route path="/" element={<SpotifyTopTracks />} />
					<Route path="/callback" element={<SpotifyTopTracks />} />
				</Routes>
				<Footer />
			</div>
		</Router>
	)
}

export default App
