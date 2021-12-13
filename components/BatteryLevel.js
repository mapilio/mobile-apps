import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { convertHexToRGBA } from "../helper/helper";
import { CustomText } from "../highordercomponents";
import * as Battery from "expo-battery";
import { UPDATE_BATTERY_LEVEL } from "../store/actionsName";
import { useDispatch } from "react-redux";

const BatteryLevel = () => {
  const dispatch = useDispatch();
  const [batteryLevel, setBatteryLevel] = useState(0);
  let subscription = null;

  useEffect(() => {
    _subscribeBatteryLevel();

    return _unsubscribeBatteryLevel;
  }, [batteryLevel]);

  const _subscribeBatteryLevel = async () => {
    let batteryLevel = await Battery.getBatteryLevelAsync();
    batteryLevel = Math.ceil(batteryLevel * 100);
    setBatteryLevel(batteryLevel);
    subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryLevel(batteryLevel);
      dispatch({ type: UPDATE_BATTERY_LEVEL, payload: batteryLevel });
    });
  };

  const _unsubscribeBatteryLevel = () => {
    subscription && subscription.remove();
    subscription = null;
  };

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        marginTop: RFValue(17),
        marginLeft: RFValue(18),
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <CustomText
        style={{
          color: "#FFFFFF",
          fontSize: RFValue(12),
          marginRight: RFValue(8),
          marginBottom: RFValue(-3),
        }}
      >
        {batteryLevel}%
      </CustomText>
      <View
        style={{
          maxWidth: RFValue(48),
          width: RFValue(24),
          height: RFValue(10),
          borderWidth: RFValue(1),
          borderColor: convertHexToRGBA("#FFFFFF", 40),
          borderRadius: 2,
          position: "relative",
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: RFValue(20),
            background: "rgb(236, 39, 72)",
          }}
        >
          <View
            style={{
              width: `${batteryLevel}%`,
              backgroundColor: "#FFFFFF",
              height: RFValue(6),
            }}
          ></View>
        </View>
      </View>
    </View>
  );
};

export default BatteryLevel;
