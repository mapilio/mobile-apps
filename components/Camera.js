import {Camera as VisionCamera, useCameraDevices} from "react-native-vision-camera";
import {StyleSheet, View} from "react-native";
import React, {useRef} from "react";
import {cameraStyles, fakeTasksStyle} from "../styles/cameraStyles";
import RotationLine from "./RotationLine";
import CameraFrame from "./CameraFrame";
import CameraProjectInfo from "./CameraProjectInfo";
import {useDispatch, useSelector} from "react-redux";
import {TooltipWrapper} from "./Tooltip";
import {tooltipContents} from "../util/consts/tooltip";
import SelectProjectButton from "./SelectProjectButton";
import {useNavigation} from "@react-navigation/native";
import {CameraWarnings} from "../helper/camera";
import {UPDATE_CAMERA_REF, UPDATE_CAMERA_STATUS} from "../store/actionsName";

const Camera = () => {
  const {back: device} = useCameraDevices();
  const dispatch = useDispatch();
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const {auth} = useSelector((state) => state.getTokenReducer);
  const {isActive} = useSelector((state) => state.cameraReducer);
  const {isInitialized} = useSelector((state) => state.tooltipReducer.camera);

  const handleCameraReady = () => {
    dispatch({ type: UPDATE_CAMERA_STATUS, payload: "READY" });
    dispatch({ type: UPDATE_CAMERA_REF, payload: cameraRef.current });
  };

  const FakeTasks = () => <SelectProjectButton navigation={navigation}/>

  if (device) {
    return (
      <View style={{flex: 1}}>
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
          enableZoomGesture={false}
          hdr={false}
        />

        <View style={styles.cameraContents}>
          <RotationLine/>
          <CameraFrame/>
          {auth && <CameraProjectInfo/>}
          {!auth && !isInitialized && (
            <View style={fakeTasksStyle}>
              <TooltipWrapper
                name="tasks"
                content={tooltipContents.camera.tasks}
                placement={"bottom"}
              >
                <FakeTasks/>
              </TooltipWrapper>
            </View>
          )}

          {isInitialized && <CameraWarnings />}
        </View>
      </View>
    );
  }

  return <View style={{flex: 1, backgroundColor: "black"}}/>
}

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