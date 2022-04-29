import React, { useEffect, useRef, useState } from "react";
import {
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  CustomText,
  CustomTextBold,
} from "../highordercomponents";
import { convertHexToRGBA } from "../helper/helper";
import {
  GoBackIcon,
  InformationIcon,
  SettingsIcon,
} from "../assets/svg/illustrations";
import uuid from "react-native-uuid";
import CameraActionsButtons from "./CameraActionsButtons";
import { Routes } from "../navigator/Routes";
import database from "../db";
import * as ScreenOrientation from "expo-screen-orientation";
import { useDispatch, useSelector } from "react-redux";
import {
  CAMERA_REDUCER_RESET,
  UPDATE_AUTOCAPTURE_START,
  UPDATE_PHOTO_AMOUNT,
  UPDATE_SELECTED_PROJECT,
  UPDATE_UUID,
  UPLOAD_DATA,
} from "../store/actionsName";
import * as Brightness from "expo-brightness";

const CameraSidebar = ({
  navigation,
  setLowBrigthness,
  setCameraReady,
  timeout,
  waitGPS,
}) => {
  const dispatch = useDispatch();
  const [uuidV4, setUUID] = useState("");
  const permissionsGranted = useRef(false);
  const { selectedProject, autoCaptureStart } = useSelector(
    (state) => state.settingsReducer
  );
  const { keepUUID, photoAmount } = useSelector((state) => state.cameraReducer);

  useEffect(() => {
    dispatch({ type: UPDATE_UUID, payload: uuidV4 });
  }, [uuidV4]);

  useEffect(() => {
    if (photoAmount >= 500) {
      const sequenceUUID = uuid.v4();
      setUUID(sequenceUUID);
      dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: 0 });
    }
  }, [photoAmount]);

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
    if (autoCaptureStart) {
      const sequenceUUID = uuid.v4();
      setUUID(sequenceUUID);
    } else {
      exitCapture();
      setUUID(null);
    }
  }, [autoCaptureStart]);

  useEffect(() => {
    let unsubscribe = navigation.addListener("blur", () => {
      dispatch({ type: UPDATE_UUID, payload: null });
      dispatch({
        type: UPDATE_SELECTED_PROJECT,
        payload: { type: "individual", key: 0, projectName: "lorem" },
      });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: 0 });
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
        Brightness.current = await Brightness.getBrightnessAsync();
        Brightness.setSystemBrightnessAsync(0);
        setLowBrigthness(true);
      }
    } catch (error) {
      console.error(error);
    }

    if (permissionsGranted.current) {
      Brightness.setSystemBrightnessAsync(0);
      setLowBrigthness(true);
    }
  };

  const exitCapture = () => {
    if (photoAmount >= 5) {
      database.query(
        "SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid ORDER BY id DESC",
        (_, result) => {
          dispatch({ type: UPLOAD_DATA, payload: result.rows._array });
        }
      );
      exitHandler();
    } else {
      database.deleteRow(uuidV4);
      dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: 0 });
    }
  };

  const exitFromCamera = async () => {
    navigation.navigate(Routes.map);
    exitHandler();
    // THIS CODE BLOCK MAYBE LATER GONNA ADD
    // if (photoAmount >= 5) {
    //   database.query(
    //     "SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid ORDER BY id DESC",
    //     (_, result) => {
    //       dispatch({ type: UPLOAD_DATA, payload: result.rows._array });
    //     }
    //   );
    //   exitHandler();
    // } else if (photoAmount >= 1 && photoAmount <= 4) {
    //   Alert.alert(
    //     "Capture failed",
    //     "For capture, you need to take at least 5 photos",
    //     [
    //       {
    //         text: "Exit",
    //         style: "cancel",
    //         onPress: () => {
    //           exitHandler();
    //           database.deleteRow(uuidV4);
    //         },
    //       },
    //       {
    //         text: "Continue",
    //         onPress: () => false,
    //       },
    //     ]
    //   );
    // } else if (photoAmount === 0) {
    //   navigation.navigate(Routes.map);
    //   exitHandler();
    // }
  };

  const exitHandler = async () => {
    await ScreenOrientation.unlockAsync();
    setCameraReady(false);
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: 0 });
    navigation.navigate(Routes.profile);
    StatusBar.setHidden(false);
    dispatch({ type: CAMERA_REDUCER_RESET });
    dispatch({
      type: UPDATE_SELECTED_PROJECT,
      payload: { type: "individual", key: 0 },
    });
    setCameraReady(false);
    waitGPS.current = true;
    clearTimeout(timeout?.current);
    dispatch({ type: UPDATE_AUTOCAPTURE_START, payload: false });
    timeout.current = null;
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
          <CameraActionsButtons
            uuid={uuidV4}
            navigation={navigation}
            exitCapture={exitCapture}
          />
          {/* <TouchableOpacity
            style={{ position: "absolute", bottom: 0, left: 0 }}
          >
            <MapIcon />
          </TouchableOpacity> */}
        </>
      )}
    </View>
  );
};

export default CameraSidebar;
