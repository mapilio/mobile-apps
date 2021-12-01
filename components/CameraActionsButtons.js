import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AutoActionButton from "./AutoActionButton";
import ManuelActionButton from "./ManuelActionButton";

const CameraActionsButtons = () => {
  const [disabled, setDisabled] = useState(false);
  const { GPSStatus, GPSAccuracy, camera, captureType } = useSelector(
    (state) => state.cameraReducer
  );

  useEffect(() => {
    if (GPSStatus && GPSAccuracy && camera) {
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
