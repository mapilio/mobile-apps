import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import AutoActionButton from "./AutoActionButton";
import {CAPTURE_BUTTON_STATUS} from "../store/actionsName";

const CameraActionsButtons = () => {
  const [waitGPS, setWaitGPS] = useState(true);
  const {
    GPSAccuracy,
    GPSStartAccuracy,
    batteryLevel,
    mocked,
    accuracy,
    batteryStatus
  } = useSelector((state) => state.cameraReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (waitGPS) {
      setWaitGPS(!GPSStartAccuracy);
      dispatch({type: CAPTURE_BUTTON_STATUS, payload: !GPSStartAccuracy});
    }
  }, [GPSStartAccuracy, waitGPS]);

  useEffect(() => {
    if (!waitGPS) {
      dispatch({type: CAPTURE_BUTTON_STATUS, payload: (GPSAccuracy || !batteryStatus || !mocked || accuracy.isTrue)});
    }
  }, [GPSAccuracy, waitGPS, mocked, batteryLevel, accuracy]);


  return (
    <>
      {/* <ManuelActionButton disabled={false} uuid={uuid} /> */}
      <AutoActionButton />
    </>
  );
};

export default CameraActionsButtons;
