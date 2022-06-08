import React, {useEffect, useRef, useState} from "react";
import {AppState, Dimensions, TouchableOpacity, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {convertHexToRGBA} from "../helper/helper";
import {PlayIcon, StopIcon} from "../assets/svg/illustrations";
import * as Location from "expo-location";
import Database from "../db";
import * as FileSystem from "expo-file-system";
import {useDispatch, useSelector} from "react-redux";
import {
	UPDATE_AUTOCAPTURE_START,
	UPDATE_IMAGE_SIZE,
	UPDATE_PHOTO_AMOUNT,
	UPDATE_UUID,
	UPLOAD_DATA
} from "../store/actionsName";
import {toastMessage} from "../helper/alerts";
import {getHeading} from "../helper/heading";
import uuid from "react-native-uuid";

const AutoActionButton = ({navigation}) => {
	const {
		cameraStatus,
		camera,
		photoAmount,
		accuracy,
		keepUUID,
		GPSStartAccuracy,
		GPSAccuracy,
		rotateStatus,
		batteryStatus,
		mocked,
		highSpeed,
		captureButtonStatus
	} = useSelector((status) => status.cameraReducer);
	const {userInformation} = useSelector((state) => state.getTokenReducer);
	const {selectedProject, distanceBetween, autoCaptureStart} = useSelector((status) => status.settingsReducer);
	const appState = useRef(AppState.currentState);
	const [appStateVisible, setAppStateVisible] = useState(appState.current);
	const [isNowCapture, setNowCapture] = useState(false);
	const [location, setLocation] = useState(null);
	const [isAlert, setIsAlert] = useState(null);
	let photo = photoAmount;
	let currentUUID = keepUUID;
	const dispatch = useDispatch();

	const playHandler = () => {
		dispatch({type: UPDATE_AUTOCAPTURE_START, payload: true});
	};

	const stopHandler = () => {
		dispatch({type: UPDATE_AUTOCAPTURE_START, payload: false});
	};

	useEffect(() => {
		if (captureButtonStatus && !isAlert && autoCaptureStart && location?.coords) {
			if (photo === 250) {
				photo = 0;
				currentUUID = uuid.v4();
				dispatch({type: UPDATE_UUID, payload: currentUUID});
				dispatch({type: UPDATE_PHOTO_AMOUNT, payload: photo});
			} else {
				incrementAmount();
				takePicture(location)
			}
		}
	}, [location]);

	const watchLocation = async () => {
		await Location.watchPositionAsync({
				accuracy: Location.Accuracy.High,
				distanceInterval: distanceBetween
			}, (location) => {
				setLocation(location);
			}
		);
	};

	useEffect(() => {
		watchLocation();
		let setTimeout = null;
		AppState.addEventListener("change", startNewSequence);

		return () => {
			AppState.removeEventListener("change", startNewSequence);
			if (setTimeout) {
				clearTimeout(setTimeout);
			}
		};
	}, []);

	let startNewSequence = (nextAppState) => {
		let timeout = null;
		if (autoCaptureStart) {
			if (appState.current.match(/inactive|background/) && nextAppState === "active") {
				appState.current = nextAppState;
				setAppStateVisible(appState.current);
				setNowCapture(false);
				appState.current = nextAppState;
				setAppStateVisible(appState.current);
				toastMessage.info("Your new sequence has been started.");
				timeout = setTimeout(() => {
					if (photoAmount >= 5) {
						Database.query(
							"SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid ORDER BY id DESC",
							(_, result) => {
								dispatch({type: UPLOAD_DATA, payload: result.rows._array});
							}
						);
					} else {
						Database.deleteRow(currentUUID);
					}
					dispatch({type: UPDATE_PHOTO_AMOUNT, payload: 0});
				}, 1000);
			} else {
				appState.current = nextAppState;
				setAppStateVisible(appState.current);
			}
		}
	};

	useEffect(() => {
		setIsAlert(!(GPSStartAccuracy && GPSAccuracy && !rotateStatus && !batteryStatus && !mocked && !highSpeed))
	}, [GPSStartAccuracy, GPSAccuracy, rotateStatus, batteryStatus, mocked, highSpeed]);


	// TODO ADD TO HELPER.JS
	const takePicture = async (location) => {
		if (cameraStatus !== "READY") return;
		const options = {
			quality: 0.6,
			base64: false,
			exif: true,
			skipProcessing: true,
			onPictureSaved: (image) => savePicture(image, location)
		}
		if (!autoCaptureStart) return;
		if (!accuracy.degree) return;
		setNowCapture(true);
		await camera.takePictureAsync(options)
	};

	const savePicture = async (image, location) => {
		const id = userInformation.id;
		const imageUri = image.uri;
		if (!imageUri) {
			setNowCapture(false);
			return;
		}
		const metaDataDir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + `${id}/${currentUUID}`);
		const isDir = metaDataDir.isDirectory;

		if (!isDir) {
			try {
				await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + `${id}/${currentUUID}`, {intermediates: true});
			} catch (e) {
				console.info("ERROR", e);
				setNowCapture(false);
			}
		}

		const newPath = FileSystem.documentDirectory + `${id}/${currentUUID}/${Math.round(new Date().getTime() / 1000).toString()}.${"jpeg"}`;

		await FileSystem.copyAsync({from: imageUri, to: newPath});
		image.uri = newPath;
		location.coords.heading = await getHeading();
		const JSONExif = JSON.stringify(image.exif);
		const JSONLocation = JSON.stringify(location);
		Database.insertToDB({
			JSONExif,
			JSONLocation,
			projectKey: selectedProject.projectKey,
			organizationName: selectedProject.projectName,
			organizationKey: selectedProject.organizationKey,
			uuid: currentUUID,
			path: newPath,
		});
		setNowCapture(false);
		const fileInfo = await FileSystem.getInfoAsync(newPath);
		dispatch({ type: UPDATE_IMAGE_SIZE, payload: fileInfo.size });
	}


	const incrementAmount = () => {
		photo = photo + 1;
		dispatch({type: UPDATE_PHOTO_AMOUNT, payload: photo});
	};

	const decrementAmount = () => {
		photo = photo - 1;
		dispatch({type: UPDATE_PHOTO_AMOUNT, payload: photo});
	};

	if (autoCaptureStart) {
		return (
			<TouchableOpacity
				// disabled={isNowCapture}
				style={{
					width: RFValue(61),
					height: RFValue(61),
					marginBottom: RFValue(-55),
					marginTop: RFValue(35),
				}}
				onPress={stopHandler}
			>
				<View
					style={{
						position: "absolute",
						top: "12%",
						left: "12%",
						bottom: "12%",
						right: "12%",
						borderRadius: Math.round(Dimensions.get("window").width + Dimensions.get("window").height) / 2,
						backgroundColor: "#ffffff",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<StopIcon/>
				</View>
				<View
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						borderWidth: RFValue(5),
						margin: RFValue(-2),
						borderColor: convertHexToRGBA("#FFFFFF", 10),
						borderRadius:
							Math.round(
								Dimensions.get("window").width + Dimensions.get("window").height
							) / 2,
					}}
				/>
			</TouchableOpacity>
		);
	} else {
		return (
			<TouchableOpacity
				disabled={!captureButtonStatus}
				style={{
					width: RFValue(61),
					height: RFValue(61),
					marginBottom: RFValue(-55),
					marginTop: RFValue(35),
				}}
				onPress={playHandler}
			>
				<View
					style={{
						position: "absolute",
						top: "12%",
						left: "12%",
						bottom: "12%",
						right: "12%",
						borderRadius:
							Math.round(
								Dimensions.get("window").width + Dimensions.get("window").height
							) / 2,
						backgroundColor: "#ffffff",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<PlayIcon/>
				</View>
				<View
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						borderWidth: RFValue(5),
						margin: RFValue(-2),
						borderColor: convertHexToRGBA("#FFFFFF", 10),
						borderRadius:
							Math.round(
								Dimensions.get("window").width + Dimensions.get("window").height
							) / 2,
					}}
				/>
			</TouchableOpacity>
		);
	}
};

export default AutoActionButton;
