import * as htmlToImage from "html-to-image"

export const exportAsImage = async (element, fileName) => {
	try {
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

		// Generate image
		const dataUrl = await htmlToImage.toPng(element, {
			quality: 1.0,
			backgroundColor: null,
			pixelRatio: 3,
			skipAutoScale: true,
			style: {
				transform: "none",
			},
			filter: (node) => {
				// Skip elements with certain classes if needed
				return !node.classList?.contains("exclude-from-image")
			},
		})

		// Download image
		const link = document.createElement("a")
		link.download = `${fileName}.png`
		link.href = dataUrl
		link.click()
	} catch (error) {
		console.error("Error exporting image:", error)
	}
}
