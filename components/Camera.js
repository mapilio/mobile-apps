import React, {useRef} from "react";
import {Camera as ExpoCamera} from "expo-camera";

import {cameraStyles} from "../styles/cameraStyles";
import CameraFrame from "./CameraFrame";
import RotationLine from "./RotationLine";
import {CameraWarnings} from "../helper/camera";
import CameraProjectInfo from "./CameraProjectInfo";
import {UPDATE_CAMERA_REF, UPDATE_CAMERA_STATUS} from "../store/actionsName";
import {useDispatch, useSelector} from "react-redux";
import {Routes} from "../navigator/Routes";

const Camera = ({navigation}) => {
  const cameraRef = useRef(null);
  const {cameraWalkthroughStatus} = useSelector((state) => state.generalReducer);

  const dispatch = useDispatch();

  const handleCameraReady = () => {
    dispatch({type: UPDATE_CAMERA_STATUS, payload: "READY"});
    dispatch({type: UPDATE_CAMERA_REF, payload: cameraRef.current});

    !cameraWalkthroughStatus && navigation.navigate(Routes.walkthrough);
  }

  return (
    <ExpoCamera
      style={cameraStyles.camera}
      ref={cameraRef}
      onCameraReady={handleCameraReady}
      autoFocus={"off"}
      focusDepth={.85}
    >
      <RotationLine/>
      <CameraFrame navigation={navigation}/>
      <CameraProjectInfo navigation={navigation}/>
      <CameraWarnings/>
    </ExpoCamera>
  );

};

export default Camera;
