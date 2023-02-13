import React, {  useRef } from "react";
import {
  Camera as VisionCamera,
  useCameraDevices,
} from "react-native-vision-camera";
import { cameraStyles, fakeTasksStyle } from "../styles/cameraStyles";
import CameraFrame from "./CameraFrame";
import RotationLine from "./RotationLine";
import { CameraWarnings } from "../helper/camera";
import CameraProjectInfo from "./CameraProjectInfo";
import { UPDATE_CAMERA_REF, UPDATE_CAMERA_STATUS } from "../store/actionsName";
import { useDispatch, useSelector } from "react-redux";
import { View, StyleSheet } from "react-native";
import SelectProjectButton from "./SelectProjectButton";
import { TooltipWrapper } from "./Tooltip";
import { tooltipContents } from "../util/consts/tooltip";

const Camera = ({ navigation }) => {
  const cameraRef = useRef(null);
  const { auth } = useSelector((state) => state.getTokenReducer);
  const { isActive } = useSelector((state) => state.cameraReducer);
  const devices = useCameraDevices();
  const device = devices.back;
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.tooltipReducer.camera);

  const handleCameraReady = () => {
    dispatch({ type: UPDATE_CAMERA_STATUS, payload: "READY" });
    dispatch({ type: UPDATE_CAMERA_REF, payload: cameraRef.current });
  };

  const FakeTasks = () => {
    return (
        <SelectProjectButton
          navigation={navigation}
        />
    );
  };

  if (device) {
    return (
      <View style={{ flex: 1 }}>
        <VisionCamera
          style={cameraStyles.camera}
          ref={cameraRef}
          device={device}
          isActive={isActive}
          photo={true}
          enableDepthData={true}
          onInitialized={handleCameraReady}
          enableHighQualityPhotos={false}
          zoom={1}
          enableZoomGesture={true}
          hdr={false}
        />
        <View style={styles.cameraContents}>
          <RotationLine />
          <CameraFrame navigation={navigation} />
          {auth && <CameraProjectInfo navigation={navigation} />}
          {!auth && !isInitialized && (
            <View style={fakeTasksStyle}>
              <TooltipWrapper
                name="tasks"
                content={tooltipContents.camera.tasks}
                placement={"bottom"}
              >
                <FakeTasks />
              </TooltipWrapper>
            </View>
          )}
          {isInitialized && <CameraWarnings />}
        </View>
      </View>
    );
  } else {
    return (
      <View style={{flex:1, backgroundColor:"black"}} />
    );
  }
};

const styles = StyleSheet.create({
  cameraContents: {
    width: "80%",
    height: "100%",
    flex: 1,
    position: "absolute",
    zIndex: 2,
  },
});

export default Camera;
