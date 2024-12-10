// import { colorConstants } from "fxui"

/** Get complementary named html color of input named html color */
export function getComplementaryColor(colorHexValue: string) {
	// Convert hex to RGB
	const rgbValues = hexToRgb(colorHexValue)

	// Calculate the complementary color by inverting the RGB values
	const complementaryRgb = rgbValues.map(value => 255 - value) as [number, number, number]

	// Convert the complementary color back to hex
	const hexComplementary = rgbToHex(...complementaryRgb)

	return hexComplementary
}

/** Convert color hex to RGB */
function hexToRgb(hex: string): [number, number, number] {
	// Remove the hash at the start if it's there
	hex = hex.replace(/^#/, '')

	// Parse r, g, b values
	let bigint = parseInt(hex, 16)
	let r = (bigint >> 16) & 255
	let g = (bigint >> 8) & 255
	let b = bigint & 255

	return [r, g, b]
}

/** Convert color RGB to hex */
export function rgbToHex(r: number, g: number, b: number) {
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}