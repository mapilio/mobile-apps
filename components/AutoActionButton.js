import React, {useEffect, useRef, useState} from "react";
import {AppState, TouchableOpacity, View} from "react-native";
import {PlayIcon, StopIcon} from "../assets/svg/illustrations";
import Database from "../db";
import * as FileSystem from "expo-file-system";
import {useDispatch, useSelector} from "react-redux";
import {
	UPDATE_AUTOCAPTURE_START,
	UPDATE_IMAGE_SIZE,
	UPDATE_PHOTO_AMOUNT,
	UPDATE_UUID,
} from "../store/actionsName";
import uuid from "react-native-uuid";
import {cameraActionButtonStyles} from "../styles/cameraStyles";
import {setNewUUID} from "../helper/camera";
import {toastMessage} from "../helper/alerts";

const AutoActionButton = ({navigation}) => {
	const {
		camera,
		photoAmount,
		accuracy,
		keepUUID,
		GPSAccuracy,
		rotateStatus,
		batteryStatus,
		mocked,
		highSpeed,
		captureButtonStatus,
		cameraLocation
	} = useSelector((status) => status.cameraReducer);
	const {userInformation} = useSelector((state) => state.getTokenReducer);
	const {selectedProject, autoCaptureStart} = useSelector((status) => status.settingsReducer);
	const appState = useRef(AppState.currentState);
	const [isAlert, setIsAlert] = useState(null);
	const [accuracyErrorCount, setAccuracyErrorCount] = useState(0);
	let photo = photoAmount;
	let currentUUID = keepUUID;
	const dispatch = useDispatch();

	const playHandler = () => {
		if (!isAlert) {
			dispatch({type: UPDATE_AUTOCAPTURE_START, payload: !autoCaptureStart})
		}
	};

	useEffect(() => {
		if (!GPSAccuracy) {
			setAccuracyErrorCount(prev => prev + 1)
		} else if (accuracyErrorCount > 0) {
			setAccuracyErrorCount(0)
		}

		if (captureButtonStatus && !isAlert && autoCaptureStart && cameraLocation) {
			if (photo === 250) {
				photo = 0;
				currentUUID = uuid.v4();
				dispatch({type: UPDATE_UUID, payload: currentUUID});
				dispatch({type: UPDATE_PHOTO_AMOUNT, payload: photo});
			} else {
				takePicture(cameraLocation).catch((err) => console.log("take picture error ", err));
			}
		}
	}, [cameraLocation]);

	useEffect(() => {
		accuracyErrorCount === 2 && setNewUUID();
	}, [accuracyErrorCount]);


	useEffect(() => {
		navigation.addListener("blur", () => {
			dispatch({ type: UPDATE_AUTOCAPTURE_START, payload: false });
		});

		return () => {
			navigation.removeListener("blur");
		};
	}, [navigation]);

	useEffect(() => {
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
			}
		}
	};

	useEffect(() => {
		setIsAlert(!(GPSAccuracy && !rotateStatus && !batteryStatus && !mocked && !highSpeed))
	}, [GPSAccuracy, rotateStatus, batteryStatus, mocked, highSpeed]);


	// TODO ADD TO HELPER.JS
	const takePicture = async (location) => {
		if (!autoCaptureStart || !accuracy.degree) {
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
		camera.takePictureAsync(options).catch((error) => console.log(error))
	};

	const savePicture = async (image, location) => {
		calculateAmount("add");

		const id = userInformation.id;
		const imageUri = image.uri;
		if (!imageUri) {
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
