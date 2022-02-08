import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import AutoActionButton from "./AutoActionButton";
import ManuelActionButton from "./ManuelActionButton";

const CameraActionsButtons = ({ uuid, navigation }) => {
  const [disabled, setDisabled] = useState(true);
  const [waitGPS, setWaitGPS] = useState(true);
  const { captureType } = useSelector((state) => state.settingsReducer);
  const {
    GPSStatus,
    GPSAccuracy,
    GPSStartAccuracy,
    camera,
    batteryLevel,
    mocked,
    highSpeed,
  } = useSelector((state) => state.cameraReducer);

  useEffect(() => {
    if (!waitGPS) return;
    if (GPSStartAccuracy) {
      setWaitGPS(false);
      setDisabled(false);
    }
  }, [GPSStartAccuracy, waitGPS]);

  useEffect(() => {
    if (waitGPS) return;
    const batteryError =
      Platform.OS === "android" ? batteryLevel <= 15 : batteryLevel <= 20;
    if (
      GPSStatus &&
      GPSAccuracy &&
      GPSStatus &&
      batteryError &&
      !highSpeed &&
      !mocked
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [GPSStatus, GPSAccuracy, waitGPS]);

  return (
    <>
      <ManuelActionButton
        disabled={disabled}
        uuid={uuid}
        navigation={navigation}
      />
      {/* <AutoActionButton disabled={disabled} uuid={uuid} /> */}
    </>
  );
};

export default CameraActionsButtons;
