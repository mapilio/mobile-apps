import React, { useEffect, useState } from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomText } from "../highordercomponents";
import { convertHexToRGBA } from "../helper/helper";
import {
  GoBackIcon,
  InformationIcon,
  MapIcon,
  SettingsIcon,
} from "../assets/svg/illustrations";
import uuid from "react-native-uuid";
import CameraActionsButtons from "./CameraActionsButtons";
import { Routes } from "../navigator/Routes";
import * as ScreenOrientation from "expo-screen-orientation";
import { useDispatch, useSelector } from "react-redux";
import { CAMERA_REDUCER_RESET, UPDATE_AUTOCAPTURE_START, UPDATE_SELECTED_PROJECT, UPDATE_UUID } from "../store/actionsName";

const CameraSidebar = ({ navigation }) => {
  const [uuidV4, setUUID] = useState("");
  const dispatch = useDispatch();
  const { selectedProject } = useSelector((state) => state.settingsReducer);
  const { keepUUID } = useSelector((state) => state.cameraReducer);

  useEffect(() => {
    navigation.addListener("focus", () => {
      if (keepUUID) {
        setUUID(keepUUID);
      } else {
        const sequenceUUID = uuid.v4();
        setUUID(sequenceUUID);
      }
    });
  }, [navigation]);

  useEffect(() => {
    navigation.addListener("blur", () => {
      dispatch({ type: UPDATE_UUID, payload: null });
      dispatch({
        type: UPDATE_SELECTED_PROJECT,
        payload: { type: "individual", key: 0, projectName: "lorem" },
      });
    });
  }, [navigation]);

  useEffect(() => {
    const sequenceUUID = uuid.v4();
    setUUID(sequenceUUID);
  }, [selectedProject]);

  const exitFromCamera = async () => {
    await ScreenOrientation.unlockAsync();
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    navigation.navigate(Routes.profile);
    StatusBar.setHidden(false);
    dispatch({ type: CAMERA_REDUCER_RESET })
    dispatch({
      type: UPDATE_SELECTED_PROJECT,
      payload: { type: "individual", key: 0 },
    });
  };

  return (
    <View
      style={{
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <TouchableOpacity
        style={{ position: "absolute", top: 0, left: 0 }}
        onPress={() => {
          navigation.navigate(Routes.generalSettings);
          dispatch({ type: UPDATE_UUID, payload: uuidV4 });
        }}
      >
        <SettingsIcon />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ position: "absolute", top: RFValue(40), left: RFValue(2) }}
        onPress={() => navigation.navigate(Routes.walkthrough)}
      >
        <InformationIcon />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ position: "absolute", top: 0, right: 0 }}
        onPress={exitFromCamera}
      >
        <GoBackIcon />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(Routes.cameraSettings);
          dispatch({ type: UPDATE_UUID, payload: uuidV4 });
        }}
      >
        <CustomText
          style={{
            color: convertHexToRGBA("#FFFFFF", 75),
            fontSize: RFValue(14),
          }}
        >
          Advanced
        </CustomText>
      </TouchableOpacity>
      <CameraActionsButtons uuid={uuidV4} navigation={navigation} />
      <TouchableOpacity style={{ position: "absolute", bottom: 0, left: 0 }}>
        <MapIcon />
      </TouchableOpacity>
    </View>
  );
};

export default CameraSidebar;
