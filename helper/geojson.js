import {centroid} from "@turf/turf"

const getCoordinate = (data) => {
	if (data.location) {
		return [JSON.parse(data.location).longitude, JSON.parse(data.location).latitude]
	}
	return [Number(data.longitude), Number(data.latitude)]
}

const setLineGeoJson = (data = []) => {
	let line = {
		type: "FeatureCollection",
		features: [{type: "Feature", geometry: {type: "LineString", coordinates: []}, properties: {}}]
	};

	data.map((properties) => {
		line.features[0].geometry.coordinates.push(getCoordinate(properties));
	});

	return line;
}

const setPointGeoJson = (data) => {
	let points = {type: "FeatureCollection", features: []};

	data.map((item) => {
		points.features.push({
			type: "Feature",
			properties: {item},
			geometry: { type: "Point", coordinates: getCoordinate(item) },
		});
	});

	return points;
}


/**
 * @param data {array}
 * @param type {string ?: "line" | "point"}
 * @returns {object}
 */
export const setGeoJson = (data, type) => {
	let geoJson = {};

	switch (type) {
		case "line":
			geoJson = setLineGeoJson(data);
			break
		case "point":
			geoJson = setPointGeoJson(data)
			break
		default:
			break
	}

	return geoJson;
}

export const centerCoordinatesByPolygons = (geoJson) => {
	let points = {type: "FeatureCollection", features: []};

	geoJson.features.map((feature, _i) => {
		let centeredPoint = centroid(feature);
		centeredPoint.properties = feature.properties
		points.features.push(centeredPoint)
	})

	return points;
}
