import React, { useEffect, useState } from "react";
import {Platform, View} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { convertHexToRGBA } from "../helper/helper";
import { CustomText } from "../highordercomponents";
import * as Battery from "expo-battery";
import {UPDATE_BATTERY_LEVEL, UPDATE_BATTERY_STATUS, UPDATE_CHARGE_STATUS} from "../store/actionsName";
import {useDispatch, useSelector} from "react-redux";

const BatteryLevel = () => {
  const dispatch = useDispatch();

  const { batteryLevel, isCharge } = useSelector((state) => state.cameraReducer);

  useEffect(() => {
    _subscribeBatteryLevel();
  }, []);

  useEffect(() => {
    const alertLevel = Platform.OS === "ios" ? 101 : 15

    dispatch({
      type: UPDATE_BATTERY_STATUS,
      payload: !isCharge && (batteryLevel <= alertLevel)
    })
  }, [batteryLevel, isCharge])

  const _subscribeBatteryLevel = () => {
    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      dispatch({ type: UPDATE_BATTERY_LEVEL, payload: Math.ceil(batteryLevel * 100) });
    });

    const subscriptionState = Battery.addBatteryStateListener(({batteryState}) => {
      dispatch({type: UPDATE_CHARGE_STATUS, payload: (batteryState === 3 || batteryState === 2)});
    });

    return () => {
      subscription.remove()
      subscriptionState.remove()
    };
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
