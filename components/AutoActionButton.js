import React, { Fragment, useEffect, useRef, useState } from 'react';
import { AppState, View, Pressable, Text, Platform } from 'react-native';
import { PlayIcon, StopIcon } from '../assets/svg/illustrations';
import db from '../db';
import { useDispatch, useSelector } from 'react-redux';
import {
  TOGGLE_ROTATE_ALERT,
  UPDATE_AUTOCAPTURE_START,
  UPDATE_IMAGE_SIZE,
  UPDATE_PHOTO_AMOUNT,
} from '../store/actionsName';
import uuid from 'react-native-uuid';
import { cameraActionButtonStyles } from '../styles/cameraStyles';
import { Accelerometer, Gyroscope, DeviceMotion } from 'expo-sensors';
import { useTranslation } from 'react-i18next';
import { vibrate } from '../util/helpers';
import { distance } from '@turf/turf';
import * as ImageManipulator from 'expo-image-manipulator';
import { cloneDeep } from 'lodash';
import * as RNFS from '../util/fs';
import { useNavigation } from '@react-navigation/native';

const AutoActionButton = () => {
  const {
    camera,
    accuracy,
    GPSAccuracy,
    rotateStatus,
    showRotateAlert,
    batteryStatus,
    mocked,
    captureButtonStatus,
    cameraLocation,
    groupId,
  } = useSelector((status) => status.cameraReducer);
  const navigation = useNavigation();
  const { selectedProject, autoCaptureStart, defaultStoragePath, distanceBetween } = useSelector(
    (status) => status.settingsReducer
  );
  const { debugMode } = useSelector((status) => status.generalReducer);
  const appState = useRef(AppState.currentState);
  const [isAlert, setIsAlert] = useState(true);
  const accelerometerData = useRef({ x: 0, y: 0, z: 0 });
  const gyroscopeData = useRef({ x: 0, y: 0, z: 0 });
  const timeoutsRef = useRef([]);
  const { isInitialized } = useSelector((state) => state.tooltipReducer.camera);
  const pitch = useRef(0);
  const roll = useRef(0);
  const lastLocation = useRef({
    longitude: 0,
    latitude: 0,
  });
  const currentUUID = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation('camera');
  const captureCount = useRef(0);
  const isSessionStarted = useRef(false);
  const captureID = useRef(0);
  const lastCaptureLocation = useRef({ longitude: 0, latitude: 0 });

  const LANDSCAPE_LEFT_ORIENTATION = Platform.OS === 'ios' ? 90 : -90;
  const LANDSCAPE_RIGHT_ORIENTATION = Platform.OS === 'ios' ? -90 : 90;

  const playHandler = () => {
    vibrate('medium');

    if (!isAlert && !autoCaptureStart && isInitialized) {
      dispatch({ type: UPDATE_AUTOCAPTURE_START, payload: true });
    }

    if (autoCaptureStart) {
      dispatch({ type: UPDATE_AUTOCAPTURE_START, payload: false });

      if (captureCount.current >= 5) {
        return toast.show(t('success_capture'), { type: 'white' });
      }

      toast.show(t('failed_capture'), { type: 'warning' });
    }
  };

  const newSequence = () => {
    currentUUID.current = uuid.v4();
  };

  useEffect(() => {
    if (captureButtonStatus && !isAlert && autoCaptureStart && cameraLocation) {
      const lastLocationCoords = [lastLocation.current.longitude, lastLocation.current.latitude];
      const newLocationCoords = [cameraLocation.longitude, cameraLocation.latitude];

      const distanceSinceLastUpdate = distance(lastLocationCoords, newLocationCoords, {
        units: 'meters',
      });

      // Detect large gap (pause/resume or first capture) — start new sequence
      if (!isSessionStarted.current || distanceSinceLastUpdate >= 50) {
        newSequence();
        isSessionStarted.current = true;
        lastCaptureLocation.current = cameraLocation;
      }

      lastLocation.current = cameraLocation;

      // Check distance from last capture point using user's distance setting
      const lastCaptureCoords = [
        lastCaptureLocation.current.longitude,
        lastCaptureLocation.current.latitude,
      ];
      const distanceSinceLastCapture = distance(lastCaptureCoords, newLocationCoords, {
        units: 'meters',
      });

      if (distanceSinceLastCapture >= distanceBetween) {
        lastCaptureLocation.current = cameraLocation;
        takePicture(cameraLocation, captureID.current).catch(() =>
          toast.show(t('something_went_wrong'), { type: 'error' })
        );
        captureID.current++;
      }
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

        const livePitch = Math.degrees(beta);
        const liveRoll = Math.degrees(gamma);

        const isLandscapeLeft = orientation === LANDSCAPE_LEFT_ORIENTATION;
        const isLandscapeRight = orientation === LANDSCAPE_RIGHT_ORIENTATION || orientation === 0;

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
    const unsubFocus = navigation.addListener('focus', () => {
      newSequence();
    });

    const unsubBlur = navigation.addListener('blur', () => {
      dispatch({ type: UPDATE_AUTOCAPTURE_START, payload: false });
    });
    return () => {
      unsubFocus();
      unsubBlur();
    };
  }, [navigation]);

  useEffect(() => {
    if (rotateStatus) {
      // Start a new sequence if the user is not rotating the phone for 7 seconds
      timeoutsRef.current.push(setTimeout(() => newSequence(), 7000));

      // Stop the capture if the user is not rotating the phone for 3 seconds
      timeoutsRef.current.push(setTimeout(() => setIsAlert(true), 3000));
    } else {
      setIsAlert(false);
      dispatch({ type: TOGGLE_ROTATE_ALERT, payload: false });
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    }

    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, [rotateStatus]);

  useEffect(() => {
    let timeout;

    if (!showRotateAlert) {
      timeout = setTimeout(() => dispatch({ type: TOGGLE_ROTATE_ALERT, payload: true }), 3000);
    }

    return () => clearTimeout(timeout);
  }, [showRotateAlert]);

  useEffect(() => {
    Accelerometer.setUpdateInterval(200);
    Gyroscope.setUpdateInterval(200);
    DeviceMotion.setUpdateInterval(200);

    const listener = AppState.addEventListener('change', startNewSequence);
    const accelerometer = Accelerometer.addListener((data) => {
      accelerometerData.current = data;
    });
    const gyroscope = Gyroscope.addListener((data) => {
      gyroscopeData.current = data;
    });

    return () => {
      accelerometer.remove();
      gyroscope.remove();
      listener.remove();
    };
  }, []);

  const startNewSequence = (nextAppState) => {
    if (autoCaptureStart) {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        appState.current = nextAppState;
        setTimeout(() => db.getGroupByWithGroupID().then(() => newSequence()), 1000);
      } else {
        appState.current = nextAppState;
      }
    }
  };

  useEffect(() => {
    setIsAlert(!(GPSAccuracy && !batteryStatus && !mocked));
  }, [GPSAccuracy, batteryStatus, mocked]);

  // TODO ADD TO HELPER.JS
  const takePicture = async (location, captureID) => {
    if (!autoCaptureStart || !accuracy.degree) return;

    const options = {
      qualityPrioritization: 'speed',
      flash: 'off',
      exif: true,
      base64: false,
    };

    // Snapshot sensor data at trigger time — same moment as GPS coordinates
    const sensorData = cloneDeep({
      accelerometer: accelerometerData.current,
      gyroscope: gyroscopeData.current,
      pitch: pitch.current,
      roll: roll.current,
    });

    camera.takePictureAsync(options).then((image) => {
      vibrate('light');
      savePicture(image, location, sensorData, captureID);
    });
  };

  const savePicture = async (image, location, sensorData, captureID) => {
    const imageUri = image.path;

    if (!imageUri) return;

    let storagePath = RNFS.DocumentDirectoryPath;

    if (defaultStoragePath === 'external') {
      storagePath = await RNFS.getRemovableExternalFilesDir();
      if (!storagePath) return;
    }

    const isExit = await RNFS.exists(storagePath + `/${groupId}`);
    if (!isExit) {
      try {
        await RNFS.mkdir(storagePath + `/${groupId}`);
      } catch (e) {
        toast.show(t('something_went_wrong'), { type: 'error' });
      }
    }

    const filename = (
      (Math.random() + 1).toString(36).substring(7) + Math.round(new Date().getTime() / 1000)
    ).toString();
    const newPath = storagePath + `/${groupId}/${filename}.${'jpeg'}`;

    const compressedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: image.width, height: image.height } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    );
    await RNFS.moveFile(compressedImage.uri, newPath);
    await RNFS.unlink(`${imageUri}`);

    image.uri = newPath;
    db.insertToDB({
      exif: JSON.stringify({
        ...image.exif,
        accelerometer: sensorData.accelerometer,
        gyroscope: sensorData.gyroscope,
        exifPitch: sensorData.pitch,
        exifRoll: sensorData.roll,
        captureWidth: image.width,
        captureHeight: image.height,
        focalLength35: image.exif?.FocalLenIn35mmFilm,
        focalLength: image.exif?.FocalLength,
      }),
      location: JSON.stringify(location),
      projectKey: selectedProject.projectKey,
      organizationName: selectedProject.projectName,
      organizationKey: selectedProject.organizationKey,
      uuid: currentUUID.current,
      path: `${groupId}/${filename}.${'jpeg'}`,
      filename,
      groupId,
      captureID,
      defaultStoragePath,
    });
    const fileInfo = await RNFS.stat(newPath);
    dispatch({ type: UPDATE_IMAGE_SIZE, payload: fileInfo.size });
    calculateAmount('add');
    if (captureCount.current % 250 === 0 && isSessionStarted.current) {
      newSequence();
    }
  };

  /**@param operator {string ?: "add" | "subtract"}*/
  const calculateAmount = (operator) => {
    switch (operator) {
      case 'add':
        captureCount.current += 1;
        dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: captureCount.current });
        break;
      case 'subtract':
        captureCount.current -= 1;
        dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: captureCount.current });
        break;
      default:
        break;
    }
  };

  return (
    <Fragment>
      <Pressable
        disabled={!captureButtonStatus}
        style={cameraActionButtonStyles.container}
        onPress={playHandler}
        accessibilityRole="button"
        accessibilityLabel={autoCaptureStart ? t('stop_capture') : t('start_capture')}
        accessibilityState={{ disabled: !captureButtonStatus }}>
        <View style={cameraActionButtonStyles.button}>
          {autoCaptureStart ? <StopIcon /> : <PlayIcon />}
        </View>
        <View style={cameraActionButtonStyles.buttonBuffer} />
      </Pressable>
      {debugMode && (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFF', textAlign: 'left' }}>
            GPSAccuracy: {cameraLocation?.accuracy.toFixed(2) || 0}
            {'\n'}
            Heading: {cameraLocation?.heading.toFixed(2) || 0}
            {'\n'}
            Pitch: {pitch.current.toFixed(2) || 0}
            {'\n'}
            Roll: {roll.current.toFixed(2) || 0}
          </Text>
        </View>
      )}
    </Fragment>
  );
};

export default AutoActionButton;
