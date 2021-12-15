import React, { useEffect, useState } from "react";
import { View, StatusBar, TouchableHighlight, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as ScreenOrientation from "expo-screen-orientation";
import { CloseIcon } from "../assets/svg/illustrations";
import { convertHexToRGBA } from "../helper/helper";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import SwitchSelector from "react-native-switch-selector";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { UPDATE_CAPTURE_TYPE } from "../store/actionsName";

const CameraSettings = ({ navigation }) => {
  const { photoAmount, batteryLevel, phoneMemory } = useSelector(
    (state) => state.cameraReducer
  );
  const dispatch = useDispatch();
  const { captureType } = useSelector((state) => state.settingsReducer);
  const [index, setIndex] = useState(0);
  const [options] = useState([
    { label: "Manuel", value: "manuel" },
    { label: "Automatic", value: "automatic" },
  ]);

  useEffect(() => {
    StatusBar.setHidden(true);
    if (captureType) {
      setIndex(0);
    } else {
      setIndex(1);
    }
  }, [captureType]);

  const switchHandler = (value) => {
    value === "manuel"
      ? dispatch({ type: UPDATE_CAPTURE_TYPE, payload: true })
      : dispatch({ type: UPDATE_CAPTURE_TYPE, payload: false });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#2A2B2F",
        height: "100%",
        paddingHorizontal: RFValue(38),
        paddingVertical: RFValue(35),
      }}
    >
      <TouchableHighlight
        style={{
          width: RFValue(26),
          height: RFValue(26),
          backgroundColor: convertHexToRGBA("#7E86B0", 20),
          justifyContent: "center",
          alignItems: "center",
          borderRadius: Math.round(
            (Dimensions.get("window").height + Dimensions.get("window").width) /
              2
          ),
          alignSelf: "flex-end",
          marginTop: RFValue(-10),
        }}
        onPress={() => navigation.goBack()}
      >
        <CloseIcon />
      </TouchableHighlight>
      <CustomText
        style={{
          fontSize: RFValue(20),
          color: "#B9C0CF",
          marginBottom: RFValue(28),
        }}
      >
        Camera Settings
      </CustomText>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: RFValue(16),
        }}
      >
        <CustomText style={{ fontSize: RFValue(14), color: "#FFFFFF" }}>
          Captured images / Remaining images
        </CustomText>
        <View style={{ flexDirection: "row" }}>
          <CustomTextMedium
            style={{
              fontSize: RFValue(14),
              color: "#1AD971",
            }}
          >
            {photoAmount}
          </CustomTextMedium>
          <CustomTextMedium
            style={{
              color: "#FFFFFF",
              fontSize: RFValue(14),
              marginHorizontal: RFValue(3),
            }}
          >
            /
          </CustomTextMedium>
          <CustomTextMedium style={{ color: "#FFFFFF", fontSize: RFValue(14) }}>
            {phoneMemory}
          </CustomTextMedium>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: RFValue(16),
        }}
      >
        <CustomText style={{ fontSize: RFValue(14), color: "#FFFFFF" }}>
          Battery level
        </CustomText>
        <CustomTextMedium style={{ fontSize: RFValue(14), color: "#FFFFFF" }}>
          %{batteryLevel}
        </CustomTextMedium>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CustomText style={{ fontSize: RFValue(14), color: "#FFFFFF" }}>
          Capture mode
        </CustomText>
        <SwitchSelector
          options={options}
          textColor={"#FFFFFF"}
          height={RFValue(30)}
          selectedColor={"#1AD971"}
          buttonColor={"#FFFFFF"}
          backgroundColor={convertHexToRGBA("#CBD1D9", 20)}
          initial={index}
          fontSize={RFValue(14)}
          onPress={switchHandler}
          accessibilityLabel={"Camera mode selection"}
          style={{ width: RFValue(186) }}
        />
      </View>
    </View>
  );
};

export default CameraSettings;
