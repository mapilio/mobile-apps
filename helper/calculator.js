/**
 * @param horizontal_pixel
 * @param vertical_pixel
 * @returns {number}
 */
const pixelPitch = (horizontal_pixel, vertical_pixel) => {
	return (Math.sqrt(horizontal_pixel * horizontal_pixel + vertical_pixel * vertical_pixel) / 10) *
		(25.4 / Math.sqrt(horizontal_pixel * horizontal_pixel + vertical_pixel * vertical_pixel));
}

export const calculate = {
	/**
	 * @param horizontal_pixel {number} horizontal pixel of the image
	 * @param vertical_pixel {number} vertical pixel of the image
	 * @param focal_length {number} focal length of the image
	 * @param	type {string ?: "horizontal" | "vertical"}
	 * @returns {number}
	 */
	fov: (horizontal_pixel, vertical_pixel, focal_length, type) => {
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
				toast.show("You sent wrong parameter!", {type: "warning"})
				break
		}

		return fov;
	},

	/**
	 * @param accelerometer {object: {x: number, y: number, z: number}}
	 * @returns {number}
	 */
	pitch: (accelerometer) => {
		return 180 * Math.atan(accelerometer.x / Math.sqrt(accelerometer.y * accelerometer.y + accelerometer.z * accelerometer.z)) / Math.PI;
	},

	/**
	 * @param accelerometer {object: {x: number, y: number, z: number}}
	 * @returns {number}
	 */
	roll: (accelerometer) => {
		return 180 * Math.atan(accelerometer.y / Math.sqrt(accelerometer.x * accelerometer.x + accelerometer.z * accelerometer.z)) / Math.PI;
	},

	/**
	 * @param accelerometer {object: {x: number, y: number, z: number}}
	 * @returns {number}
	 */
	yaw: (accelerometer) => {
		return 180 * Math.atan(accelerometer.z / Math.sqrt(accelerometer.x * accelerometer.x + accelerometer.z * accelerometer.z)) / Math.PI
	}
}
