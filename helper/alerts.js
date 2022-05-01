import {Notifier, NotifierComponents} from "react-native-notifier";
import {StatusBar} from "react-native";
import {errorAlertStyles, infoAlertStyles, successAlertStyles, warningAlertStyles} from "../styles/alertStyles";

const toastGenerator = (title, image, containerStyle, titleStyle, imageStyle, duration = 3000) => {
	Notifier.showNotification({
		title: title,
		Component: NotifierComponents.Notification,
		swipeEnabled: true,
		duration: duration,
		translucentStatusBar: StatusBar.currentHeight,
		componentProps: {
			imageSource: image,
			imageStyle: imageStyle,
			titleStyle: titleStyle,
			containerStyle: containerStyle,
		},
	});
};

export const toastMessage = {
	success: (message) => {
		toastGenerator(
			message,
			require("../assets/images/Success.png"),
			successAlertStyles.alertContainer,
			successAlertStyles.alertTitle,
			successAlertStyles.alertImage
		)
	},

	info: (message) => {
		toastGenerator(
			message,
			require("../assets/images/Info.png"),
			infoAlertStyles.alertContainer,
			infoAlertStyles.alertTitle,
			infoAlertStyles.alertImage,
		);
	},

	warning: (message) => {
		toastGenerator(
			message,
			require("../assets/images/Warning.png"),
			warningAlertStyles.alertContainer,
			warningAlertStyles.alertTitle,
			warningAlertStyles.alertImage,
		)
	},

	error: (message) => {
		toastGenerator(
			message,
			require("../assets/images/Error.png"),
			errorAlertStyles.alertContainer,
			errorAlertStyles.alertTitle,
			errorAlertStyles.alertImage,
		);
	}
}