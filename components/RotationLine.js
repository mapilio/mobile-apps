import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {UPDATE_ACCURACY, UPDATE_ROTATE_STATUS} from "../store/actionsName";

const RotationLine = ({ degree }) => {
  const dispatch = useDispatch();
  const {accuracy, rotateStatus} = useSelector((state) => state.cameraReducer);
  const lineDegree = degree - 90;

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
  }, [rotateStatus]);

  useEffect(() => {
    const betweenPositiveLandscape = between(lineDegree, Platform.OS === "android" ? 160 : 152, Platform.OS === "android" ? 205 : 190);
    const betweenHighNegativeLandscape = between(lineDegree, -190, -160);
    const betweenNegativeLandscape = between(lineDegree, -25, 25);

    dispatch({
      type: UPDATE_ROTATE_STATUS,
      payload: !betweenNegativeLandscape && !betweenPositiveLandscape && !betweenHighNegativeLandscape
    })
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
