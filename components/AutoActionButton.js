import React, { useEffect, useState } from "react";
import { Dimensions, Platform, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { convertHexToRGBA } from "../helper/helper";
import { PlayIcon, StopIcon } from "../assets/svg/illustrations";
import * as Location from "expo-location";
import Database from "../db";
import * as FileSystem from "expo-file-system";
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE_AUTOCAPTURE_START,
  UPDATE_IMAGE_SIZE,
  UPDATE_PHOTO_AMOUNT,
} from "../store/actionsName";

const AutoActionButton = ({
  disabled,
  setDisabled,
  uuid,
  navigation,
  GPSStatus,
  GPSAccuracy,
  batteryLevel,
  mocked,
  highSpeed,
}) => {
  const { cameraStatus, camera, photoAmount, isCharge, accuracy } = useSelector(
    (status) => status.cameraReducer
  );
  const { userInformation } = useSelector((state) => state.getTokenReducer);
  const { selectedProject, distanceBetween, autoCaptureStart } = useSelector(
    (status) => status.settingsReducer
  );
  let photo = photoAmount;
  const dispatch = useDispatch();

  const playHandler = () => {
    dispatch({ type: UPDATE_AUTOCAPTURE_START, payload: true });
  };

  const stopHandler = () => {
    dispatch({ type: UPDATE_AUTOCAPTURE_START, payload: false });
  };

  useEffect(() => {
    let batteryError = false;
    if (isCharge) {
      batteryError = false;
    } else {
      batteryError =
        Platform.OS === "android" ? batteryLevel <= 15 : batteryLevel <= 20;
    }
    if (!GPSAccuracy || batteryError || highSpeed || mocked) {
      return;
    } else {
      var location = null;
      const watchLocation = async () => {
        location = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: distanceBetween,
          },
          (location) => {
            if (disabled) {
              return;
            } else {
              takePicture(location);
            }
          }
        );
      };
      watchLocation();
      return () => {
        location?.remove();
      };
    }
  }, [
    autoCaptureStart,
    disabled,
    distanceBetween,
    isCharge,
    mocked,
    highSpeed,
    batteryLevel,
    accuracy,
  ]);

  useEffect(() => {
    let unsubscribe = navigation.addListener("blur", (e) => {
      dispatch({ type: UPDATE_AUTOCAPTURE_START, payload: false });
    });
    return unsubscribe;
  }, [navigation]);

  const getMode = (a, b) => {
    return ((a % b) + b) % b;
  };

  const between = (x, min, max) => {
    return x >= min && x <= max;
  };

  // TODO ADD TO HELPER.JS
  const takePicture = async (location) => {
    const id = userInformation.id;
    if (cameraStatus !== "READY") return;
    const options = { quality: 0.6, base64: false, exif: true };
    if (!autoCaptureStart) return;
    const image = await camera.takePictureAsync(options);
    const betweenPositiveLandscape = between(accuracy.degree, 175, 205);
    let heading = await Location.getHeadingAsync();
    heading.trueHeading = betweenPositiveLandscape
      ? getMode(heading.trueHeading + 90, 360)
      : getMode(heading.trueHeading - 90, 360);
    heading.magHeading = betweenPositiveLandscape
      ? getMode(heading.trueHeading + 90, 360)
      : getMode(heading.trueHeading - 90, 360);
    const imageUri = image.uri;
    if (!imageUri) return;
    const metaDataDir = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + `${id}/${uuid}`
    );
    const isDir = metaDataDir.isDirectory;
    if (!isDir) {
      try {
        await FileSystem.makeDirectoryAsync(
          FileSystem.documentDirectory + `${id}/${uuid}`,
          { intermediates: true }
        );
      } catch (e) {
        console.info("ERROR", e);
      }
    }
    const newPath =
      FileSystem.documentDirectory +
      `${id}/${uuid}/${Math.random().toString()}.${"jpeg"}`;
    await FileSystem.copyAsync({
      from: imageUri,
      to: newPath,
    });
    image.uri = newPath;
    let newHeading =
      heading.trueHeading === -1 ? heading.magHeading : heading.trueHeading;
    location.coords.heading = newHeading;
    const JSONExif = JSON.stringify(image.exif);
    const JSONLocation = JSON.stringify(location);
    Database.insertToDB({
      JSONExif,
      JSONLocation,
      projectKey: selectedProject.projectKey,
      organizationName: selectedProject.projectName,
      organizationKey: selectedProject.organizationKey,
      uuid,
      path: newPath,
    });
    const fileInfo = await FileSystem.getInfoAsync(newPath);
    dispatch({ type: UPDATE_IMAGE_SIZE, payload: fileInfo.size });
    incrementAmount();
  };

  const incrementAmount = () => {
    photo = photo + 1;
    dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: photo });
  };

  if (autoCaptureStart) {
    return (
      <TouchableOpacity
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
            borderRadius:
              Math.round(
                Dimensions.get("window").width + Dimensions.get("window").height
              ) / 2,
            backgroundColor: "#ffffff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StopIcon />
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
        ></View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        disabled={disabled}
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
          <PlayIcon />
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
        ></View>
      </TouchableOpacity>
    );
  }
};

export default AutoActionButton;
