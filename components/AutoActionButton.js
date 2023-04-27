import React, {Fragment, useEffect, useRef, useState} from "react";
import {AppState, View, Pressable,Text} from "react-native";
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
import { Accelerometer, Gyroscope, DeviceMotion } from "expo-sensors";
import {useTranslation} from "react-i18next";
import {vibrate} from "../util/helpers";
import * as ImageManipulator from "expo-image-manipulator";

const AutoActionButton = ({navigation}) => {
	const {
		debugMode,
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
	const {accelerometerData} = useRef({x: 0, y: 0, z: 0})
	const {gyroscopeData} = useRef({x: 0, y: 0, z: 0});
	const [timeouts, setTimeouts] = useState([]);
	const {isInitialized} = useSelector((state) => state.tooltipReducer.camera);
	const pitch = useRef(0);
  const roll = useRef(0);
	let photo = photoAmount;
	let currentUUID = keepUUID;
	const dispatch = useDispatch();
	const {t} = useTranslation("camera");

	const LANDSCAPE_LEFT_ORIENTATION = Platform.OS === "ios" ? 90 : -90;
  const LANDSCAPE_RIGHT_ORIENTATION = Platform.OS === "ios" ? -90 : 90;

	const playHandler = () => {
		vibrate("medium");

		if (!isAlert && !autoCaptureStart && isInitialized) {
			dispatch({type: UPDATE_AUTOCAPTURE_START, payload: true})
		}

		if (autoCaptureStart) {
			dispatch({type: UPDATE_AUTOCAPTURE_START, payload: false})
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

	Math.degrees = (radians) => {
    return radians * (180 / Math.PI);
  };

  useEffect(() => {
    const subscription = DeviceMotion.addListener((data) => {
      if (data.rotation) {
        const { beta, gamma } = data.rotation;
        const { orientation } = data;

        const livePitch = Math.degrees(beta)
        const liveRoll = Math.degrees(gamma)

        const isLandscapeLeft = orientation === LANDSCAPE_LEFT_ORIENTATION;
        const isLandscapeRight =
          orientation === LANDSCAPE_RIGHT_ORIENTATION || orientation === 0;

       	const temp = livePitch;
        // we need to adjust the values based on the orientation of the phone
        if (isLandscapeLeft) {
          pitch.current = liveRoll - 90;
          roll.current = -temp;
        } else if (isLandscapeRight) {
          pitch.current = -liveRoll - 90;
          roll.current = temp;
        }
      }
    });

    return () => subscription.remove();
  }, []);

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
		const accelerometer = Accelerometer.addListener(data => {
			accelerometerData.current = data;
		})
		const gyroscope = Gyroscope.addListener(data => {
			gyroscopeData.current = data;
		})

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
				setTimeout(() => db.getGroupByWithGroupID().then(() => newSequence()), 1000);
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

		const compressedImage = await ImageManipulator.manipulateAsync(imageUri, [{resize: {width: image.width, height:image.height}}], {compress: 0.5, format: ImageManipulator.SaveFormat.JPEG})
		await FileSystem.moveAsync({from: compressedImage.uri, to: newPath});

		FileSystem.deleteAsync(`file://${imageUri}`, {idempotent: true});
		
		image.uri = newPath;
		db.insertToDB({
      exif: JSON.stringify({
        ...image.metadata,
        ...image.metadata["{Exif}"],
        accelerometer: accelerometerData.current,
        gyroscope: gyroscopeData.current,
		exifPitch: pitch.current,
		exifRoll: roll.current,
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
		<Fragment>
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
		{
				debugMode && (
						<View style={{justifyContent:"center", alignItems:"center"}}>
							<Text style={{color: '#FFF', textAlign: 'left'}}>
							GPSAccuracy: {cameraLocation?.accuracy.toFixed(2) || 0}
							{"\n"}
							Heading: {cameraLocation?.heading || 0}
							{"\n"}
							Pitch: {pitch.current}
							{"\n"}
							Roll: {roll.current}
						</Text>
						</View>
				)
			}
		</Fragment>
	)
};

export default AutoActionButton;
