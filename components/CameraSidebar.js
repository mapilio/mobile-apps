import React, { useEffect, useRef, useState } from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  CustomText,
  CustomTextBold,
  CustomTextMedium,
} from "../highordercomponents";
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
import {
  CAMERA_REDUCER_RESET,
  UPDATE_AUTOCAPTURE_START,
  UPDATE_SELECTED_PROJECT,
  UPDATE_UUID,
} from "../store/actionsName";
import * as Brightness from "expo-brightness";

const CameraSidebar = ({ navigation, setLowBrigthness }) => {
  const dispatch = useDispatch();
  const [uuidV4, setUUID] = useState("");
  const permissionsGranted = useRef(false);
  const { selectedProject, autoCaptureStart } = useSelector(
    (state) => state.settingsReducer
  );
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

  const lowLightHandler = async () => {
    try {
      let permissions = await Brightness.getPermissionsAsync();

      if (permissions.status !== "granted" && permissions.canAskAgain) {
        permissions = await Brightness.requestPermissionsAsync();
      }

      if (permissions.status === "granted") {
        permissionsGranted.current = true;
        brightness.current = await Brightness.getBrightnessAsync();
        Brightness.setSystemBrightnessAsync(0);
        setLowBrigthness(true);
      }
    } catch (e) {
      console.log("Something wrong with brightness permissions");
    }

    if (permissionsGranted.current) {
      Brightness.setSystemBrightnessAsync(0);
      setLowBrigthness(true);
    }
  };

  const exitFromCamera = async () => {
    await ScreenOrientation.unlockAsync();
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    navigation.navigate(Routes.profile);
    StatusBar.setHidden(false);
    dispatch({ type: CAMERA_REDUCER_RESET });
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
      {autoCaptureStart ? (
        <View
          style={{
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CustomTextBold
            style={{
              color: "#FFFFFF",
              marginTop: RFValue(15),
              marginTop: RFValue(-50),
              textAlign: "center",
            }}
          >
            Capture has started
          </CustomTextBold>
          <CustomText
            style={{
              textAlign: "center",
              color: "#FFFFFF",
              fontSize: RFValue(12),
            }}
          >
            In the meantime, make sure that the angle of your camera is correct
            and stable.
          </CustomText>
          <CameraActionsButtons uuid={uuidV4} navigation={navigation} />
          <CustomTextBold
            style={{
              color: "#ffc231",
              textAlign: "center",
              bottom: RFValue(-80),
            }}
            onPress={lowLightHandler}
          >
            Power safe mode
          </CustomTextBold>
        </View>
      ) : (
        <>
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
          <TouchableOpacity
            style={{ position: "absolute", bottom: 0, left: 0 }}
          >
            <MapIcon />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default CameraSidebar;
