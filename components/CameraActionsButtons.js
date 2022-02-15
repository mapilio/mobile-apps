import React, { useEffect, useState } from "react";
import { LogBox, Platform } from "react-native";
import { useSelector } from "react-redux";
import AutoActionButton from "./AutoActionButton";
import ManuelActionButton from "./ManuelActionButton";

const CameraActionsButtons = ({ uuid, navigation }) => {
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
    if (!GPSAccuracy || batteryError || highSpeed || mocked) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [GPSAccuracy, waitGPS, isCharge, highSpeed, mocked, batteryLevel]);

  return (
    <>
      {/* <ManuelActionButton disabled={disabled} uuid={uuid} /> */}
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
      />
    </>
  );
};

export default CameraActionsButtons;
