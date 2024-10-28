import html2canvas from "html2canvas"

export const exportAsImage = async (element, fileName) => {
	try {
		const canvas = await html2canvas(element, {
			scale: 2,
			backgroundColor: null,
			logging: false,
			useCORS: true,
			allowTaint: true,
			windowWidth: document.documentElement.offsetWidth,
			windowHeight: document.documentElement.offsetHeight,
		})

		const image = canvas.toDataURL("image/png", 1.0)
		const link = document.createElement("a")
		link.download = `${fileName}.png`
		link.href = image
		link.click()
	} catch (error) {
		console.error("Error exporting image:", error)
	}
}
