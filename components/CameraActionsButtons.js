import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import AutoActionButton from "./AutoActionButton";
import ManuelActionButton from "./ManuelActionButton";

const CameraActionsButtons = ({uuid}) => {
  const [disabled, setDisabled] = useState(false);
  const { GPSStatus, GPSAccuracy, camera, batteryLevel } = useSelector(
    (state) => state.cameraReducer
  );
  const { captureType } = useSelector((state) => state.settingsReducer);

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
      {captureType && <ManuelActionButton disabled={disabled} uuid={uuid} />}
      {!captureType && <AutoActionButton disabled={disabled} uuid={uuid} />}
    </>
  );
};

export default CameraActionsButtons;
