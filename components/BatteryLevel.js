import React, {useEffect} from "react";
import {Platform, StyleSheet, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {convertHexToRGBA} from "../helper/helper";
import {CustomText} from "../highordercomponents";
import {UPDATE_BATTERY_LEVEL, UPDATE_BATTERY_STATUS, UPDATE_CHARGE_STATUS} from "../store/actionsName";
import {useDispatch, useSelector} from "react-redux";
import {addBatteryLevelListener, addBatteryStateListener, getBatteryLevelAsync} from "expo-battery";

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
    getBatteryLevelAsync().then((batteryLevel) => {
      dispatch({type: UPDATE_BATTERY_LEVEL, payload: Math.round(batteryLevel * 100)});
    })

    const subscription = addBatteryLevelListener(({batteryLevel}) => {
      dispatch({type: UPDATE_BATTERY_LEVEL, payload: Math.ceil(batteryLevel * 100)});
    });

    const subscriptionState = addBatteryStateListener(({batteryState}) => {
      dispatch({type: UPDATE_CHARGE_STATUS, payload: (batteryState === 3 || batteryState === 2)});
    });

    return () => {
      subscription.remove()
      subscriptionState.remove()
    };
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.batteryInfo}>
        <CustomText style={{color: "#FFFFFF", fontSize: RFValue(12)}}>
          {batteryLevel}%
        </CustomText>
        <View style={styles.batteryIcon}>
          <View style={{width: RFValue(20)}}>
            <View style={{width: `${batteryLevel}%`, backgroundColor: "#FFFFFF", height: RFValue(6)}}/>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    borderLeftWidth: 1.2,
    borderTopWidth: 1.2,
    borderColor: '#FFF',
    height: RFValue(55),
    width: RFValue(105)
  },
  batteryInfo: {
    flexDirection: "row",
    alignItems:"center",
    position: "absolute",
    top: RFValue(10),
    left: RFValue(10)
  },
  batteryIcon: {
    maxWidth: RFValue(48),
    width: RFValue(24),
    height: RFValue(10),
    borderWidth: RFValue(1),
    borderColor: convertHexToRGBA("#FFFFFF", 40),
    borderRadius: 2,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: RFValue(5)
  }
})

export default BatteryLevel;
