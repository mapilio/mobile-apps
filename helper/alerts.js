import {Notifier, NotifierComponents} from "react-native-notifier";
import {StatusBar} from "react-native";
import {errorAlertStyles, infoAlertStyles, successAlertStyles} from "../styles/alertStyles";

const toastGenerator = (title, image, containerStyle, titleStyle, imageStyle, duration = 0) => {
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

export const successToastMessage = (message) => {
	toastGenerator(
		message,
		require("../assets/images/Success.png"),
		successAlertStyles.alertContainer,
		successAlertStyles.alertTitle,
		successAlertStyles.alertImage,
		3000)
}

export const infoToastMessage = (message) => {
	toastGenerator(
		message,
		require("../assets/images/Info.png"),
		infoAlertStyles.alertContainer,
		infoAlertStyles.alertTitle,
		infoAlertStyles.alertImage,
		3000
	);
}

export const warningToastMessage = (message) => {
	toastGenerator(
		message,
		require("../assets/images/Warning.png"),
		errorAlertStyles.alertContainer,
		errorAlertStyles.alertTitle,
		errorAlertStyles.alertImage,
		3000
	)
}

export const errorToastMessage = (message) => {
	toastGenerator(
		message,
		require("../assets/images/Error.png"),
		errorAlertStyles.alertContainer,
		errorAlertStyles.alertTitle,
		errorAlertStyles.alertImage,
		3000
	);
}