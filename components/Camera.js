import {
  Camera as VisionCamera,
  useCameraDevices,
} from "react-native-vision-camera";
import { Platform, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { cameraStyles, fakeTasksStyle } from "../styles/cameraStyles";
import RotationLine from "./RotationLine";
import CameraFrame from "./CameraFrame";
import CameraProjectInfo from "./CameraProjectInfo";
import { useDispatch, useSelector } from "react-redux";
import { TooltipWrapper } from "./Tooltip";
import { tooltipContents } from "../util/consts/tooltip";
import SelectProjectButton from "./SelectProjectButton";
import { useNavigation } from "@react-navigation/native";
import { CameraWarnings } from "../helper/camera";
import { UPDATE_CAMERA_REF, UPDATE_CAMERA_STATUS } from "../store/actionsName";
import { RFValue } from "react-native-responsive-fontsize";
import { DeviceMotion } from "expo-sensors";


const Camera = () => {
  const { back: device } = useCameraDevices();
  const dispatch = useDispatch();
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const { auth } = useSelector((state) => state.getTokenReducer);
  const { isActive } = useSelector((state) => state.cameraReducer);
  const { isInitialized } = useSelector((state) => state.tooltipReducer.camera);
  const {lowResolution} = useSelector((state) => state.settingsReducer);
  const [cameraOrientation, setCameraOrientation] = useState("landscapeRight");

  const handleCameraReady = () => {
    dispatch({ type: UPDATE_CAMERA_STATUS, payload: "READY" });
    dispatch({ type: UPDATE_CAMERA_REF, payload: cameraRef.current });
  };

  const orientationSubscription = () => {

    const landscapeRight = Platform.OS === "ios" ? -90 : 90;
    const landscapeLeft = Platform.OS === "ios" ? 90 : -90;
    
    return DeviceMotion.addListener(({ orientation }) => {
      if (orientation === landscapeRight || orientation === 0) {
        setCameraOrientation((prev) => {
          if (prev === "landscapeRight") {
            return prev;
          } else {
            return "landscapeRight";
          }
        });
      } else if (orientation === landscapeLeft) {
        setCameraOrientation((prev) => {
          if (prev === "landscapeLeft") {
            return prev;
          } else {
            return "landscapeLeft";
          }
        });
      }
    });
  };

  useEffect(() => {
    const subscription = orientationSubscription();

    return () => {
      subscription.remove();
    };
  }, []);

  const FakeTasks = () => <SelectProjectButton navigation={navigation} />;

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
          enableHighQualityPhotos={lowResolution ? undefined : true}
          zoom={1}
          enableZoomGesture={false}
          preset={lowResolution ? undefined : "photo"}
          hdr={false}
          orientation={cameraOrientation}
        />

        <View style={styles.cameraContents}>
          <RotationLine />
          <CameraFrame />
          {auth && <CameraProjectInfo />}
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
  }

  return <View style={{ flex: 1, backgroundColor: "black" }} />;
};

const styles = StyleSheet.create({
  cameraContents: {
    width: "100%",
    height: "100%",
    flex: 1,
    position: "absolute",
    zIndex: 2,
    padding:RFValue(16),
  },
});

export default Camera;
