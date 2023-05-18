import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { convertHexToRGBA } from "../helper/helper";
import { CustomText } from "../highordercomponents";
import {
  UPDATE_BATTERY_LEVEL,
  UPDATE_BATTERY_STATUS,
} from "../store/actionsName";
import { useDispatch, useSelector } from "react-redux";
import { addBatteryStateListener, getBatteryLevelAsync, getBatteryStateAsync } from "expo-battery";
import { ChargeIcon } from "../assets/svg/illustrations";

const BatteryLevel = () => {
  const dispatch = useDispatch();
  const [chargeStatus, setChargeStatus] = useState(null);

  const isCharging = chargeStatus === 2;

  const { batteryLevel } = useSelector(
    (state) => state.cameraReducer
  );

  useEffect(() => {
    setBatteryLevel();
    setBatteryState();
    const batteryInterval = setInterval(() => {
      setBatteryLevel();
    }, 60000);

    const subscriptionState = addBatteryStateListener(({batteryState} ) => {
      setChargeStatus(batteryState);
    });

    return () => {
      clearInterval(batteryInterval);
      subscriptionState.remove();
    };
  }, []);

  const setBatteryState = () => {
    getBatteryStateAsync().then((batteryState) => {
      setChargeStatus(batteryState);
    });
  }

  const setBatteryLevel = () => {
    getBatteryLevelAsync().then((batteryLevel) => {
      dispatch({
        type: UPDATE_BATTERY_LEVEL,
        payload: Math.round(batteryLevel * 100),
      });
    });
  };

  useEffect(() => {
    const isLowBattery = batteryLevel <= 15 && !isCharging;
    
    dispatch({
      type: UPDATE_BATTERY_STATUS,
      payload: isLowBattery,
    });
  }, [batteryLevel, chargeStatus]);

  return (
    <View style={styles.batteryInfo}>
      <CustomText style={{ color: "#FFFFFF", fontSize: RFValue(12) }}>
        {batteryLevel}%
      </CustomText>
      <View style={styles.batteryIcon}>
        <View style={{ width: RFValue(20) }}>
          <View
            style={{
              width: `${batteryLevel}%`,
              backgroundColor: chargeStatus === 2 ? "#38B35A" : "#FFFFFF",
              height: RFValue(6),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 2,
            }}
          >
          {isCharging && (<ChargeIcon />)}
          </View>
        </View>
      
      </View>
        <View 
          style={{
            backgroundColor: convertHexToRGBA("#FFFFFF", 40),
            borderRadius: RFValue(2),
            marginLeft: RFValue(1),
            width: RFValue(1.5),
            height: RFValue(5),
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
          }} />
    </View>
  );
};

const styles = StyleSheet.create({
  batteryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  batteryIcon: {
    maxWidth: RFValue(48),
    width: RFValue(24),
    height: RFValue(10),
    borderWidth: RFValue(1),
    borderColor: convertHexToRGBA("#FFFFFF", 40),
    borderRadius: 5,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: RFValue(5),
  },
});

export default BatteryLevel;
