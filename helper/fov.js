/**
 * @param horizontal_pixel
 * @param vertical_pixel
 * @returns {number}
 */
import {toastMessage} from "./alerts";

const pixelPitch = (horizontal_pixel, vertical_pixel) => {
	return (Math.sqrt(horizontal_pixel * horizontal_pixel + vertical_pixel * vertical_pixel) / 10) *
		(25.4 / Math.sqrt(horizontal_pixel * horizontal_pixel + vertical_pixel * vertical_pixel));
}

/**
 * @param horizontal_pixel {number} horizontal pixel of the image
 * @param vertical_pixel {number} vertical pixel of the image
 * @param focal_length {number} focal length of the image
 * @param	type {string ?: "horizontal" | "vertical"}
 * @returns {number}
 */
export const fovCalculate = (horizontal_pixel, vertical_pixel, focal_length, type) => {
	const pixel_pitch = pixelPitch(horizontal_pixel, vertical_pixel)
	let fov = 0;

	switch (type) {
		case "horizontal":
			fov = (Math.round(10 * (360 / Math.PI) * Math.atan(((horizontal_pixel / 2) * pixel_pitch) / 1e3 / focal_length)) / 10)
			break
		case "vertical":
			fov = (Math.round(10 * (360 / Math.PI) * Math.atan(((vertical_pixel / 2) * pixel_pitch) / 1e3 / focal_length)) / 10)
			break
		default:
			toastMessage.warning("You sent wrong parameter!")
			break
	}

	return fov;
}