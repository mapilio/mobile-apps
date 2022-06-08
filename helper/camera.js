import {View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {
	BadGPS,
	BatteryLevelIcon,
	CameraRotate,
	GPSSearch,
	HighSpeedIcon,
	MockedIcon
} from "../assets/svg/illustrations";
import {CustomText} from "../highordercomponents";
import {cameraAlertStyles} from "../styles/cameraStyles";

const Alert = ({svg, title, content}) => {
	return (
		<View style={cameraAlertStyles.container}>
			<View style={cameraAlertStyles.card}>
				{svg}
				<CustomText
					style={cameraAlertStyles.title}
				>
					{title}
				</CustomText>
				<CustomText
					style={cameraAlertStyles.content}
				>
					{content}
				</CustomText>
			</View>
		</View>
	);
};

export const cameraAlerts = {
	battery: () => {
		return (
			<Alert
				svg={<BatteryLevelIcon/>}
				title={"Battery level low"}
				content={"GPS accuracy will decrease because your charge is below 20%. In this case, shooting is not possible."}
			/>
		);
	},
	mocked: () => {
		return (
			<Alert
				svg={<MockedIcon/>}
				title={"Fake GPS"}
				content={"Fake gps usage has been detected, please use device gps location to proceed!"}
			/>
		)
	},
	highSpeed: () => {
		return (
			<Alert
				svg={<HighSpeedIcon/>}
				title={"High speed"}
				content={"You exceeded the high speed limit. For precision, your speed should be a maximum of 70km/h."}
			/>
		)
	},
	gpsAlert: () => {
		return (
			<Alert
				svg={<BadGPS width={RFValue(34)} height={RFValue(30)}/>}
				title={"GPS accuracy is too low"}
				content={"Shooting will continue when the GPS alert icon turns green."}
			/>
		)
	},
	gpsStartAlert: () => {
		return (
			<Alert
				svg={<GPSSearch/>}
				title={"GPS Searching"}
				content={"Please be in the open area where the GPS will capture. This process can take up to 30 seconds."}
			/>
		)
	},
	rotate: () => {
		return (
			<Alert
				svg={<CameraRotate/>}
				title={"Adjust your camera angle"}
				content={"Shooting will continue when the your rotation true."}
			/>
		)
	}
}