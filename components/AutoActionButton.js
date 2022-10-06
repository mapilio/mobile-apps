import React, {useEffect, useRef, useState} from "react";
import {AppState, Platform, TouchableOpacity, View} from "react-native";
import {PlayIcon, StopIcon} from "../assets/svg/illustrations";
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
import uuid from "react-native-uuid";
import {cameraActionButtonStyles} from "../styles/cameraStyles";
import Geolocation from 'react-native-geolocation-service';

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
		dispatch({type: UPDATE_AUTOCAPTURE_START, payload: !autoCaptureStart});
	};

	useEffect(() => {
		if (captureButtonStatus && !isAlert && autoCaptureStart && location?.coords) {
			if (photo === 249) {
				photo = 0;
				currentUUID = uuid.v4();
				dispatch({type: UPDATE_UUID, payload: currentUUID});
				dispatch({type: UPDATE_PHOTO_AMOUNT, payload: photo});
			} else {
				takePicture(location).catch((err) => console.log("take picture error ", err));
			}
		}

		return () => {
			setLocation(null);
		}
	}, [location]);

	useEffect(() => {
		navigation.addListener("blur", () => {
			if (location) location.remove();
			dispatch({ type: UPDATE_AUTOCAPTURE_START, payload: false });
		});
		return () => {
			navigation.removeListener("blur");
		};
	}, [navigation]);

	const watchLocation = async () => {
		Geolocation.watchPosition(position => {
			console.log(position)
			setLocation(position)
		}, () => null, {
			distanceFilter: 5,
			enableHighAccuracy: true,
			accuracy: Platform.OS === 'android' ? 'high' : 'best',
		});
	};

	useEffect(() => {
		watchLocation().catch((error) => console.log("watchLocation() err: " + error));
		AppState.addEventListener("change", startNewSequence);

		return () => {
			AppState.removeEventListener("change", startNewSequence);
		}
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
		if (cameraStatus !== "READY" || !autoCaptureStart || !accuracy.degree) {
			calculateAmount("subtract");
			return;
		}

		const options = {
			quality: 0.2,
			base64: false,
			exif: true,
			skipProcessing: true,
			fixOrientation: true,
			onPictureSaved: (image) => savePicture(image, location)
		}
		setNowCapture(true);
		camera.takePictureAsync(options).catch((error) => console.log(error))
	};

	const savePicture = async (image, location) => {
		calculateAmount("add");

		const id = userInformation.id;
		const imageUri = image.uri;
		if (!imageUri) {
			setNowCapture(false);
			calculateAmount("subtract");
			return;
		}
		const metaDataDir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + `${id}/${currentUUID}`);
		const isDir = metaDataDir.isDirectory;

		if (!isDir) {
			try {
				await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + `${id}/${currentUUID}`, {intermediates: true});
			} catch (e) {
				console.info("ERROR", e);
				calculateAmount("subtract");
				setNowCapture(false);
			}
		}

		const newPath = FileSystem.documentDirectory + `${id}/${currentUUID}/${Math.round(new Date().getTime() / 1000).toString()}.${"jpeg"}`;

		await FileSystem.copyAsync({from: imageUri, to: newPath});
		image.uri = newPath;
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

	/**@param operator {string ?: "add" | "subtract"}*/
	const calculateAmount = (operator) => {
		switch (operator) {
			case "add":
				photo = photo + 1;
				dispatch({type: UPDATE_PHOTO_AMOUNT, payload: photo});
				break;
			case "subtract":
				photo = photo - 1;
				dispatch({type: UPDATE_PHOTO_AMOUNT, payload: photo});
				break;
			default:
				break;

		}
	}

	return (
		<TouchableOpacity
			disabled={(!captureButtonStatus && isAlert)}
			style={cameraActionButtonStyles.container}
			onPress={playHandler}
		>
			<View style={cameraActionButtonStyles.button}>
				{autoCaptureStart ? <StopIcon/> : <PlayIcon/>}
			</View>
			<View style={cameraActionButtonStyles.buttonBuffer}/>
		</TouchableOpacity>
	)
};

export default AutoActionButton;
