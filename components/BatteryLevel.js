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
import { addBatteryStateListener, getBatteryLevelAsync } from "expo-battery";

const BatteryLevel = () => {
  const dispatch = useDispatch();
  const [chargeStatus, setChargeStatus] = useState(null);

  const { batteryLevel } = useSelector(
    (state) => state.cameraReducer
  );

  useEffect(() => {
    setBatteryLevel();
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

  const setBatteryLevel = () => {
    getBatteryLevelAsync().then((batteryLevel) => {
      dispatch({
        type: UPDATE_BATTERY_LEVEL,
        payload: Math.round(batteryLevel * 100),
      });
    });
  };

  useEffect(() => {
    const isLowBattery = batteryLevel <= 15 && chargeStatus !== 2;
    
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
              backgroundColor: "#FFFFFF",
              height: RFValue(6),
            }}
          />
        </View>
      </View>
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
    borderRadius: 2,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: RFValue(5),
  },
});

export default BatteryLevel;
