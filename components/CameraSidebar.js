import {Fragment, useRef} from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {CustomText, CustomTextBold} from "../highordercomponents";
import {
  GoBackIcon,
  InformationIcon,
  SettingsIcon,
} from "../assets/svg/illustrations";
import CameraActionsButtons from "./CameraActionsButtons";
import {Routes} from "../navigator/Routes";
import {useDispatch, useSelector} from "react-redux";
import {IS_ACTIVE} from "../store/actionsName";
import * as Brightness from "expo-brightness";
import {exitCapture} from "../helper/camera";
import {useTranslation} from "react-i18next";
import {TooltipWrapper} from "./Tooltip";
import {tooltipContents} from "../util/consts/tooltip";

const CapturedComponent = ({navigation, setLowBrightness}) => {
  const {t} = useTranslation("camera");
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
    <Fragment>
      <CustomTextBold style={styles.title}>{t("title")}</CustomTextBold>
      <CustomText style={styles.description}>{t("description")}</CustomText>
      <CameraActionsButtons uuid={'uuidV4'} navigation={navigation}/>
      <CustomTextBold style={styles.safeMode} onPress={lowLightHandler}>{t("safe_mode")}</CustomTextBold>
    </Fragment>
  )
}

const CaptureComponent = ({navigation, exitHandler}) => {
  const dispatch = useDispatch();

  const changeRoute = (route) => {
    dispatch({type: IS_ACTIVE, payload: false})
    navigation.navigate(route);
  }

  return (
    <>
      <View style={styles.buttons}>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate(Routes.captureWalkthrough)}>
        <InformationIcon fill={"#333333"} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => changeRoute(Routes.generalSettings)}>
        <SettingsIcon fill={"#333333"} />
      </TouchableOpacity>

      <TouchableOpacity style={{...styles.menuButton, backgroundColor:"transparent"}} onPress={exitHandler}>
        <GoBackIcon/>
      </TouchableOpacity>
      </View>
  
      <TooltipWrapper content={tooltipContents.camera.startCapture} name={"startCapture"} placement={"left"}>
        <CameraActionsButtons uuid={'uuidV4'} navigation={navigation}/>
      </TooltipWrapper>
    </>
  )
}

const CameraSidebar = ({navigation, setLowBrightness}) => {
  const {autoCaptureStart} = useSelector((state) => state.settingsReducer);

  const exitHandler = () => {
    navigation.reset({index: 0, routes: [{name: "UploadTab"}]});
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
    flex:1,
    justifyContent: "center",
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
  buttons:{
    position: "absolute",
    top: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  menuButton:{
    backgroundColor: "#FFFFFF",
    borderRadius: RFValue(50),
    width: RFValue(40),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
  }
})

export default CameraSidebar;
