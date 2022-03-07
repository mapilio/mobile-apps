import React, { useEffect, useState } from "react";
import { LogBox, Platform } from "react-native";
import { useSelector } from "react-redux";
import AutoActionButton from "./AutoActionButton";
import ManuelActionButton from "./ManuelActionButton";

const CameraActionsButtons = ({ uuid, navigation, exitCapture }) => {
  const [disabled, setDisabled] = useState(true);
  const [waitGPS, setWaitGPS] = useState(true);
  const {
    GPSStatus,
    GPSAccuracy,
    GPSStartAccuracy,
    batteryLevel,
    mocked,
    highSpeed,
    isCharge,
    accuracy,
  } = useSelector((state) => state.cameraReducer);

  useEffect(() => {
    if (!waitGPS) return;
    if (GPSStartAccuracy) {
      setWaitGPS(false);
      setDisabled(false);
    } else {
      setDisabled(true);
      setWaitGPS(true);
    }
  }, [GPSStartAccuracy, waitGPS]);

  useEffect(() => {
    if (waitGPS) return;
    let batteryError = false;
    if (isCharge) {
      batteryError = false;
    } else {
      batteryError =
        Platform.OS === "android" ? batteryLevel <= 15 : batteryLevel <= 20;
    }
    console.log(accuracy.isTrue);
    if (
      !GPSAccuracy ||
      batteryError ||
      highSpeed ||
      mocked ||
      !accuracy.isTrue
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [
    GPSAccuracy,
    waitGPS,
    isCharge,
    highSpeed,
    mocked,
    batteryLevel,
    accuracy,
  ]);

  return (
    <>
      {/* <ManuelActionButton disabled={false} uuid={uuid} /> */}
      <AutoActionButton
        disabled={disabled}
        setDisabled={setDisabled}
        uuid={uuid}
        navigation={navigation}
        GPSStatus={GPSStatus}
        GPSAccuracy={GPSAccuracy}
        batteryLevel={batteryLevel}
        mocked={mocked}
        highSpeed={highSpeed}
        exitCapture={exitCapture}
      />
    </>
  );
};

export default CameraActionsButtons;
