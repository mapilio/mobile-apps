import {StyleSheet} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {convertHexToRGBA} from "../helper/helper";

export const cameraStyles = StyleSheet.create({
	camera: {
		flex: 1,
		position: "relative",
	},
	notReadyContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#2E2E2E",
	},
	notReadyText: {
		fontSize: RFValue(16),
		marginTop: RFValue(30),
		color: "#FFFFFF",
	}
});

export const cameraAlertStyles = StyleSheet.create({
	container: {
		position: "absolute", alignSelf: "center", bottom: "25%"
	},
	card: {
		width: RFValue(365),
		height: RFValue(155),
		backgroundColor: convertHexToRGBA("#213348", 90),
		paddingHorizontal: RFValue(18),
		paddingVertical: RFValue(25),
		borderRadius: 8,
		alignItems: "center"
	},
	title: {
		color: "#FFFFFF",
		fontSize: RFValue(14),
		marginBottom: RFValue(6),
		marginTop: RFValue(15),
	},
	content: {
		color: "#FFFFFF",
		fontSize: RFValue(12),
		textAlign: "center",
	}
})