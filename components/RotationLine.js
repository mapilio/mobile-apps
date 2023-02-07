import React, {useEffect, useState} from "react";
import {Platform, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {UPDATE_ACCURACY, UPDATE_ROTATE_STATUS} from "../store/actionsName";
import {Accelerometer} from "expo-sensors";
import {degreeCalculate} from "../helper/camera";

const RotationLine = () => {
  const dispatch = useDispatch();
  const {accuracy, rotateStatus} = useSelector((state) => state.cameraReducer);
  const [degree, setDegree] = useState(0);
  const [lineDegree, setLineDegree] = useState(-90);

  const accelerometerSubscription = () => {
    return Accelerometer.addListener(accelerometerData => {
      const calculatedDegree = degreeCalculate(accelerometerData.x, accelerometerData.y)
      setDegree(calculatedDegree)
      setLineDegree(calculatedDegree - 90)
    })
  }

  useEffect(() => {
    const accelerometer = accelerometerSubscription()

    return (() => {
      accelerometer.remove()
    })
  }, [])

  const between = (x, min, max) => {
    return x >= min && x <= max;
  };

  useEffect(() => {
    if (Boolean(accuracy) !== Boolean(rotateStatus)) {
      dispatch({type: UPDATE_ACCURACY, payload: {isTrue: !Boolean(rotateStatus), degree: degree}});
    } else {
      if (accuracy.isTrue) {
        dispatch({type: UPDATE_ACCURACY, payload: {isTrue: !Boolean(rotateStatus), degree: degree}});
      }
    }
  }, [rotateStatus]);

  useEffect(() => {
    const betweenPositiveLandscape = between(lineDegree, Platform.OS === "android" ? 160 : 152, Platform.OS === "android" ? 205 : 190);
    const betweenHighNegativeLandscape = between(lineDegree, -190, -160);
    const betweenNegativeLandscape = between(lineDegree, -25, 25);

    const status = !betweenNegativeLandscape && !betweenPositiveLandscape && !betweenHighNegativeLandscape

    dispatch({type: UPDATE_ROTATE_STATUS, payload: status})

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
      <View
        style={{
          display: rotateStatus ? "flex" : "none",
          width: "90%",
          backgroundColor: "red",
          height: 2,
          transform: [
            {
              rotate:
                lineDegree < 0
                  ? `${Math.abs(Math.round(Math.ceil(lineDegree / 5) * 5))}deg`
                  : `${-Math.abs(Math.round(Math.ceil(lineDegree / 5) * 5))}deg`,
            },
          ],
        }}
      ></View>
    </View>
  );
};

export default RotationLine;
