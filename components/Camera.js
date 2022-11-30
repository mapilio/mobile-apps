import React, {useEffect, useRef, useState} from "react";
import {Camera as VisionCamera, useCameraDevices} from "react-native-vision-camera";

import {cameraStyles} from "../styles/cameraStyles";
import CameraFrame from "./CameraFrame";
import RotationLine from "./RotationLine";
import {CameraWarnings} from "../helper/camera";
import CameraProjectInfo from "./CameraProjectInfo";
import {UPDATE_CAMERA_REF, UPDATE_CAMERA_STATUS} from "../store/actionsName";
import {useDispatch, useSelector} from "react-redux";
import {Routes} from "../navigator/Routes";
import {View, ActivityIndicator, Dimensions} from "react-native";
import {CustomTextMedium} from "../highordercomponents";
import {RFValue} from "react-native-responsive-fontsize";

const Camera = ({navigation}) => {
  const cameraRef = useRef(null);
  const {cameraWalkthroughStatus} = useSelector((state) => state.generalReducer);
  const [cameraReady, setCameraReady] = useState(false);
  const devices = useCameraDevices()
  const device = devices.back
  const dispatch = useDispatch();

  useEffect(() => {
    !cameraWalkthroughStatus && navigation.navigate(Routes.walkthrough);

    const timeout = setTimeout(() => setCameraReady(true), 500)

    return () => clearTimeout(timeout)
  }, []);

  const handleCameraReady = () => {
    dispatch({type: UPDATE_CAMERA_STATUS, payload: "READY"});
    dispatch({type: UPDATE_CAMERA_REF, payload: cameraRef.current});
  }

  if (cameraReady && cameraWalkthroughStatus && device) {
    return (
      <View style={{flex: 1}}>
        <VisionCamera
          style={cameraStyles.camera}
          ref={cameraRef}
          device={device}
          isActive={true}
          photo={true}
          enableDepthData={true}
          onInitialized={handleCameraReady}
          enableHighQualityPhotos={false}
          zoom={1}
          enableZoomGesture={true}
          hdr={false}
        />
        <View style={{
          width: Dimensions.get("window").width - RFValue(180),
          height: "100%",
          flex:1,
          position: "absolute",
          zIndex: 2,
        }}>
          <RotationLine/>
          <CameraFrame navigation={navigation}/>
          <CameraProjectInfo navigation={navigation}/>
          <CameraWarnings/>
        </View>

      </View>
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
