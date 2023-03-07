import React, {useEffect, useRef, useState} from "react";
import {AppState, View, Pressable} from "react-native";
import {PlayIcon, StopIcon} from "../assets/svg/illustrations";
import db from "../db";
import * as FileSystem from "expo-file-system";
import {useDispatch, useSelector} from "react-redux";
import {
	TOGGLE_ROTATE_ALERT,
	UPDATE_AUTOCAPTURE_START,
	UPDATE_IMAGE_SIZE,
	UPDATE_PHOTO_AMOUNT,
	UPDATE_UUID
} from "../store/actionsName";
import uuid from "react-native-uuid";
import {cameraActionButtonStyles} from "../styles/cameraStyles";
import {Accelerometer, Gyroscope} from "expo-sensors";
import {useTranslation} from "react-i18next";
import {vibrate} from "../util/helpers";
import {setNewUUID} from "../helper/camera";

const AutoActionButton = ({navigation}) => {
	const {
		camera,
		photoAmount,
		accuracy,
		keepUUID,
		GPSAccuracy,
		rotateStatus,
		showRotateAlert,
		batteryStatus,
		mocked,
		highSpeed,
		captureButtonStatus,
		cameraLocation,
		groupId,
	} = useSelector((status) => status.cameraReducer);
	const {selectedProject, autoCaptureStart} = useSelector((status) => status.settingsReducer);
	const appState = useRef(AppState.currentState);
	const [isAlert, setIsAlert] = useState(null);
	const [accelerometerData, setAccelerometerData] = useState({x: 0, y: 0, z: 0});
	const [gyroscopeData, setGyroscopeData] = useState({x: 0, y: 0, z: 0});
	const [timeouts, setTimeouts] = useState([]);
	let photo = photoAmount;
	let currentUUID = keepUUID;
	const dispatch = useDispatch();
	const {t} = useTranslation("camera");

	const playHandler = () => {
		vibrate("medium");
		if (autoCaptureStart || !isAlert) {
			dispatch({type: UPDATE_AUTOCAPTURE_START, payload: !autoCaptureStart})
		}
	};

	const newSequence = () => {
		currentUUID = uuid.v4();
		dispatch({type: UPDATE_UUID, payload: currentUUID});
	}

	useEffect(() => {
		if (captureButtonStatus && !isAlert && autoCaptureStart && cameraLocation) {
			if (!!photo && photo % 250 === 0) {
				newSequence();
			}

			takePicture(cameraLocation).catch(() => toast.show(t("something_went_wrong"), {type: "error"}));
		}
	}, [cameraLocation]);

	useEffect(() => {
		navigation.addListener("blur", () => dispatch({type: UPDATE_AUTOCAPTURE_START, payload: false}));
		return () => navigation.removeListener("blur");
	}, [navigation]);

	useEffect(() => {
		if (rotateStatus) {
			// Start a new sequence if the user is not rotating the phone for 7 seconds
			setTimeouts(prev => [...prev, setTimeout(() => newSequence(), 7000)]);

			// Stop the capture if the user is not rotating the phone for 3 seconds
			setTimeouts(prev => [...prev, setTimeout(() => setIsAlert(true), 3000)]);
		} else {
			setIsAlert(false)
			dispatch({type: TOGGLE_ROTATE_ALERT, payload: false})
			timeouts.forEach((timeout, index) => {
				clearTimeout(timeout)
				if (index === timeouts.length - 1) setTimeouts([]);
			});
		}
	}, [rotateStatus]);

	useEffect(() => {
		let timeout;

		if(!showRotateAlert) {
			timeout = setTimeout(() => dispatch({type: TOGGLE_ROTATE_ALERT, payload: true}), 3000)
		}

		return () => clearTimeout(timeout);
	}, [showRotateAlert]);

	useEffect(() => {
		const listener = AppState.addEventListener("change", startNewSequence);
		const accelerometer = Accelerometer.addListener(data => setAccelerometerData(data))
		const gyroscope = Gyroscope.addListener(data => setGyroscopeData(data))

		return () => {
			accelerometer.remove();
			gyroscope.remove();
			listener.remove();
		}
	}, []);

	let startNewSequence = (nextAppState) => {
		if (autoCaptureStart) {
			if (appState.current.match(/inactive|background/) && nextAppState === "active") {
				appState.current = nextAppState;
				setTimeout(() => {
					db.getGroupByWithGroupID().then(() => setNewUUID())
				}, 1000);
			} else {
				appState.current = nextAppState;
			}
		}
	};

	useEffect(() => {
		setIsAlert(!(GPSAccuracy && !batteryStatus && !mocked && !highSpeed))
	}, [GPSAccuracy, batteryStatus, mocked, highSpeed]);


	// TODO ADD TO HELPER.JS
	const takePicture = async (location) => {
		if (!autoCaptureStart || !accuracy.degree) {
			calculateAmount("subtract");
			return;
		}

		const options = {
			qualityPrioritization: 'speed',
			flash: "off",
		}

		camera.takePhoto(options).then((image) => savePicture(image, location))
	};

	const savePicture = async (image, location) => {
		calculateAmount("add");

		const imageUri = image.path;

		if (!imageUri) {
			calculateAmount("subtract");
			return;
		}
		const metaDataDir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + `${groupId}`);
		const isDir = metaDataDir.isDirectory;

		if (!isDir) {
			try {
				await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + `${groupId}`, {intermediates: true});
			} catch (e) {
				calculateAmount("subtract");
			}
		}

		const filename = ((Math.random() + 1).toString(36).substring(7) + Math.round(new Date().getTime() / 1000)).toString();
		const newPath = FileSystem.documentDirectory + `${groupId}/${filename}.${"jpeg"}`;

		await FileSystem.copyAsync({from: `file://${imageUri}`, to: newPath});
		image.uri = newPath;
		db.insertToDB({
			exif: JSON.stringify({
				...image.metadata,
				...image.metadata["{Exif}"],
				accelerometer: accelerometerData,
				gyroscope: gyroscopeData
			}),
			location: JSON.stringify(location),
			projectKey: selectedProject.projectKey,
			organizationName: selectedProject.projectName,
			organizationKey: selectedProject.organizationKey,
			uuid: currentUUID,
			path: `${groupId}/${filename}.${"jpeg"}`,
			filename,
			groupId,
		});
		const fileInfo = await FileSystem.getInfoAsync(newPath);
		dispatch({type: UPDATE_IMAGE_SIZE, payload: fileInfo.size});
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
		<Pressable
			disabled={!captureButtonStatus}
			style={cameraActionButtonStyles.container}
			onPress={playHandler}
		>
			<View style={cameraActionButtonStyles.button}>
				{autoCaptureStart ? <StopIcon/> : <PlayIcon/>}
			</View>
			<View style={cameraActionButtonStyles.buttonBuffer}/>
		</Pressable>
	)
};

export default AutoActionButton;
