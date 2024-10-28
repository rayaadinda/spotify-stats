import * as htmlToImage from "html-to-image"

export const exportAsImage = async (element, fileName, onProgress) => {
	try {
		// Start progress
		onProgress(10)

		// Wait for images to load
		const images = element.getElementsByTagName("img")
		const imagePromises = Array.from(images).map((img) => {
			if (img.complete) {
				return Promise.resolve()
			} else {
				return new Promise((resolve) => {
					img.onload = resolve
					img.onerror = resolve
				})
			}
		})

		await Promise.all(imagePromises)
		onProgress(40)

		// Generate image
		const dataUrl = await htmlToImage.toPng(element, {
			quality: 1.0,
			backgroundColor: null,
			pixelRatio: 4,
			width: element.offsetWidth * 2,
			height: element.offsetHeight * 2,
			skipAutoScale: false,
			style: {
				transform: "none",
				transformOrigin: "center",
				width: `${element.offsetWidth * 2}px`,
				height: `${element.offsetHeight * 2}px`,
			},
			filter: (node) => {
				return !node.classList?.contains("exclude-from-image")
			},
			canvasWidth: element.offsetWidth * 2,
			canvasHeight: element.offsetHeight * 2,
		})

		onProgress(80)

		// Download image
		const link = document.createElement("a")
		link.download = `${fileName}.png`
		link.href = dataUrl
		link.click()

		onProgress(100)
	} catch (error) {
		console.error("Error exporting image:", error)
		onProgress(0)
	}
}
