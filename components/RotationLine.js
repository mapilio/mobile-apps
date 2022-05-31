import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { CameraRotate } from "../assets/svg/illustrations";
import { UPDATE_ACCURACY } from "../store/actionsName";

const RotationLine = ({ degree, setAlert, rotateAlert }) => {
  const [appear, setAppear] = useState(false);
  const dispatch = useDispatch();
  const {accuracy} = useSelector((state) => state.cameraReducer);
  const lineDegree = degree - 90;

  const between = (x, min, max) => {
    return x >= min && x <= max;
  };

  useEffect(() => {
    if (Boolean(accuracy) !== Boolean(rotateAlert)) {
      dispatch({
        type: UPDATE_ACCURACY,
        payload: { isTrue: !Boolean(rotateAlert), degree: degree },
      });
    } else {
      if (accuracy.isTrue) {
        dispatch({
          type: UPDATE_ACCURACY,
          payload: { isTrue: !Boolean(rotateAlert), degree: degree },
        });
      }
    }
  }, [rotateAlert]);

  useEffect(() => {
    if (Platform.OS === "android") {
      const betweenPositiveLandscape = between(lineDegree, 160, 205);
      const betweenHighNegativeLandscape = between(lineDegree, -190, -160);
      const betweenNegativeLandscape = between(lineDegree, -25, 25);
      if (
        !betweenNegativeLandscape &&
        !betweenPositiveLandscape &&
        !betweenHighNegativeLandscape
      ) {
        setAppear(true);
        setAlert({
          svg: <CameraRotate />,
          title: "Adjust your camera angle",
          content: "Shooting will continue when the your rotation true.",
        });
      } else {
        setAppear(false);
        setAlert(null);
      }
    } else if (Platform.OS === "ios") {
      const betweenPositiveLandscape = between(lineDegree, 152, 190);
      const betweenHighNegativeLandscape = between(lineDegree, -190, -160);
      const betweenNegativeLandscape = between(lineDegree, -25, 25);

      if (
        !betweenNegativeLandscape &&
        !betweenPositiveLandscape &&
        !betweenHighNegativeLandscape
      ) {
        setAppear(true);
        setAlert({
          svg: <CameraRotate />,
          title: "Adjust your camera angle",
          content: "Shooting will continue when the your rotation true.",
        });
      } else if (
        betweenNegativeLandscape ||
        betweenPositiveLandscape ||
        betweenHighNegativeLandscape
      ) {
        setAppear(false);
        setAlert(null);
      }
    }
  }, [lineDegree, setAppear]);

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
          display: appear ? "flex" : "none",
          width: "90%",
          backgroundColor: "red",
          height: 2,
          transform: [
            {
              rotate:
                lineDegree < 0
                  ? `${Math.abs(Math.round(Math.ceil(lineDegree / 5) * 5))}deg`
                  : `${-Math.abs(
                      Math.round(Math.ceil(lineDegree / 5) * 5)
                    )}deg`,
            },
          ],
        }}
      ></View>
    </View>
  );
};

export default RotationLine;
