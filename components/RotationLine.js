import React, { useEffect, useRef, useState } from "react";
import { Platform, View, Animated, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_ACCURACY, UPDATE_ROTATE_STATUS } from "../store/actionsName";
import { Accelerometer } from "expo-sensors";
import { degreeCalculate } from "../helper/camera";
import { CameraLine } from "../assets/svg/illustrations";
import { TooltipWrapper } from "./Tooltip";
import { tooltipContents } from "../util/consts/tooltip";
import { DeviceMotion } from "expo-sensors";

const RotationLine = () => {
  const dispatch = useDispatch();
  const { accuracy, rotateStatus } = useSelector(
    (state) => state.cameraReducer
  );
  const [degree, setDegree] = useState(0);
  const [lineDegree, setLineDegree] = useState(-90);

  const rotateValue = useRef(new Animated.Value(0)).current;
  const statusOpacity = useRef(new Animated.Value(0)).current;

  const accelerometerSubscription = () => {
    return Accelerometer.addListener((accelerometerData) => {
      const calculatedDegree = degreeCalculate(
        accelerometerData.x,
        accelerometerData.y
      );
      setDegree(calculatedDegree);
      setLineDegree(calculatedDegree - 90);
    });
  };

  useEffect(() => {
    const accelerometer = accelerometerSubscription();

    return () => {
      accelerometer.remove();
    };
  }, []);

  const between = (x, min, max) => {
    return x >= min && x <= max;
  };

  useEffect(() => {
    if (Boolean(accuracy) !== Boolean(rotateStatus)) {
      dispatch({
        type: UPDATE_ACCURACY,
        payload: { isTrue: !Boolean(rotateStatus), degree: degree },
      });
    } else {
      if (accuracy.isTrue) {
        dispatch({
          type: UPDATE_ACCURACY,
          payload: { isTrue: !Boolean(rotateStatus), degree: degree },
        });
      }
    }

    Animated.timing(statusOpacity, {
      toValue: rotateStatus ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [rotateStatus]);

  useEffect(() => {
    const betweenPositiveLandscape = between(
      lineDegree,
      Platform.OS === "android" ? 160 : 152,
      Platform.OS === "android" ? 205 : 190
    );
    const betweenHighNegativeLandscape = between(lineDegree, -190, -160);
    const betweenNegativeLandscape = between(lineDegree, -25, 25);

    const status =
      !betweenNegativeLandscape &&
      !betweenPositiveLandscape &&
      !betweenHighNegativeLandscape;

    if (status !== rotateStatus) {
      dispatch({ type: UPDATE_ROTATE_STATUS, payload: status });
    }

    Animated.timing(rotateValue, {
      toValue: lineDegree,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [lineDegree]);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <Animated.View
        style={{
          opacity: statusOpacity,
          transform: [
            {
              rotate: rotateValue.interpolate({
                inputRange: [-90, 270],
                outputRange: ["-90deg", "270deg"],
              }),
            },
          ],
          ...styles.rotationLine,
        }}
      />

      <View style={styles.cameraLine}>
        <TooltipWrapper
          content={tooltipContents.camera.angle}
          name="angle"
          placement="bottom"
        >
          <CameraLine />
        </TooltipWrapper>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rotationLine: {
    shadowColor: "red",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 10,
    width: "45%",
    backgroundColor: "red",
    height: 2,
  },

  cameraLine: {
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RotationLine;
