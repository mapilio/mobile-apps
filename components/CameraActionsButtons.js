import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import AutoActionButton from "./AutoActionButton";
import ManuelActionButton from "./ManuelActionButton";

const CameraActionsButtons = () => {
  const [disabled, setDisabled] = useState(false);
  const { GPSStatus, GPSAccuracy, camera, captureType, batteryLevel } =
    useSelector((state) => state.cameraReducer);

  useEffect(() => {
    const batteryError =
      Platform.OS === "android" ? batteryLevel <= 15 : batteryLevel <= 20;
    if (GPSStatus && GPSAccuracy && camera && batteryError) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [GPSStatus, GPSAccuracy]);

  return (
    <>
      {captureType === "manuel" && <ManuelActionButton disabled={disabled} />}
      {captureType === "auto" && <AutoActionButton disabled={disabled} />}
    </>
  );
};

export default CameraActionsButtons;
