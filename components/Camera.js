import React, {useEffect, useRef, useState} from "react";
import {Camera as ExpoCamera} from "expo-camera";

import {cameraStyles} from "../styles/cameraStyles";
import CameraFrame from "./CameraFrame";
import RotationLine from "./RotationLine";
import {CameraWarnings} from "../helper/camera";
import CameraProjectInfo from "./CameraProjectInfo";
import {UPDATE_CAMERA_REF, UPDATE_CAMERA_STATUS} from "../store/actionsName";
import {useDispatch, useSelector} from "react-redux";
import {Routes} from "../navigator/Routes";
import {View, ActivityIndicator} from "react-native";
import {CustomTextMedium} from "../highordercomponents";

const Camera = ({navigation}) => {
  const cameraRef = useRef(null);
  const {cameraWalkthroughStatus} = useSelector((state) => state.generalReducer);
  const [cameraReady, setCameraReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => setCameraReady(true), 500)
  }, []);

  const handleCameraReady = () => {
    dispatch({type: UPDATE_CAMERA_STATUS, payload: "READY"});
    dispatch({type: UPDATE_CAMERA_REF, payload: cameraRef.current});

    !cameraWalkthroughStatus && navigation.navigate(Routes.walkthrough);
  }
  if (cameraReady) {
    return (
      <ExpoCamera
        style={cameraStyles.camera}
        ref={cameraRef}
        onCameraReady={handleCameraReady}
        autoFocus={false}
        focusDepth={.85}
      >
        <RotationLine/>
        <CameraFrame navigation={navigation}/>
        <CameraProjectInfo navigation={navigation}/>
        <CameraWarnings/>
      </ExpoCamera>
    );
  } else {
    return (
      <View style={cameraStyles.notReadyContainer}>
        <ActivityIndicator size={"large"} color={"#FFFFFF"} />
        <CustomTextMedium style={cameraStyles.notReadyText}>
          Camera is getting ready. Please wait.
        </CustomTextMedium>
      </View>
    )
  }
};

export default Camera;
