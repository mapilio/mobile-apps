import React, {useRef} from "react";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {CustomText, CustomTextBold} from "../highordercomponents";
import {convertHexToRGBA} from "../helper/helper";
import {
  GoBackIcon,
  InformationIcon,
  SettingsIcon,
} from "../assets/svg/illustrations";
import CameraActionsButtons from "./CameraActionsButtons";
import {Routes} from "../navigator/Routes";
import {useDispatch, useSelector} from "react-redux";
import {UPDATE_UUID} from "../store/actionsName";
import * as Brightness from "expo-brightness";
import {exitCapture} from "../helper/camera";

const CapturedComponent = ({navigation, setLowBrightness}) => {
  const permissionsGranted = useRef(false);

  const lowLightHandler = () => {
    try {
      Brightness.getPermissionsAsync().then(async permissions => {
        if (permissions.status !== Brightness.PermissionStatus.GRANTED && permissions.canAskAgain) {
          permissions = await Brightness.requestPermissionsAsync();
        }

        if (permissions.status === Brightness.PermissionStatus.GRANTED) {
          permissionsGranted.current = true;
          Brightness.getBrightnessAsync().then(() => {
            Brightness.setSystemBrightnessAsync(0).then(() => setLowBrightness(true))
          })
        }
      })
    } catch (e) {
      toast.show(`${e}`, {type: 'error'})
    }
  }

  return (
    <View>
      <CustomTextBold style={styles.title}>{texts.title}</CustomTextBold>
      <CustomText style={styles.description}>{texts.description}</CustomText>
      <CameraActionsButtons uuid={'uuidV4'} navigation={navigation}/>
      <CustomTextBold style={styles.safeMode} onPress={lowLightHandler}>{texts.safeMode}</CustomTextBold>
    </View>
  )
}

const CaptureComponent = ({navigation, exitHandler}) => {
  const dispatch = useDispatch();

  const changeRoute = (route) => {
    navigation.navigate(route);
    dispatch({type: UPDATE_UUID, payload: 'uuidV4'});
  }

  return (
    <>
      <TouchableOpacity style={styles.settings} onPress={() => changeRoute(Routes.generalSettings)}>
        <SettingsIcon/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.info} onPress={() => navigation.navigate(Routes.walkthrough)}>
        <InformationIcon/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exit} onPress={exitHandler}>
        <GoBackIcon/>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => changeRoute(Routes.cameraSettings)}>
        <CustomText style={styles.advanced}>{texts.advanced}</CustomText>
      </TouchableOpacity>

      <CameraActionsButtons uuid={'uuidV4'} navigation={navigation}/>
    </>
  )
}

const CameraSidebar = ({navigation, setLowBrightness}) => {
  const {autoCaptureStart} = useSelector((state) => state.settingsReducer);

  const exitHandler = () => {
    navigation.reset({index: 0, routes: [{name: Routes.upload}]});
    exitCapture();
  }

  return (
    <View style={styles.wrapper}>
      {autoCaptureStart
        ? <CapturedComponent navigation={navigation} setLowBrightness={setLowBrightness} exitHandler={exitHandler}/>
        : <CaptureComponent navigation={navigation} exitHandler={exitHandler}/>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height
  },
  title: {
    color: "#FFFFFF",
    marginTop: RFValue(-50),
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto"
  },
  description: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: RFValue(12),
  },
  safeMode: {
    color: "#ffc231",
    textAlign: "center",
    bottom: RFValue(-80),
    marginLeft: "auto",
    marginRight: "auto"
  },
  settings: {
    position: "absolute",
    top: 0,
    left: 0
  },
  info: {
    position: "absolute",
    top: RFValue(40),
    left: RFValue(2)
  },
  exit: {
    position: "absolute",
    top: 0,
    right: 0
  },
  advanced: {
    color: convertHexToRGBA("#FFFFFF", 75),
    fontSize: RFValue(14),
  }
})

const texts = {
  title: 'Capture has started',
  description: 'In the meantime, make sure that the angle of your camera is correct and stable.',
  safeMode: 'Power safe mode',
  advanced: 'Advanced',
}

export default CameraSidebar;
