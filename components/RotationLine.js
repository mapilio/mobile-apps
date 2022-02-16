import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { CameraRotate } from "../assets/svg/illustrations";
import { UPDATE_ACCURACY } from "../store/actionsName";

const RotationLine = ({ degree, setAlert, rotateAlert }) => {
  const [appear, setAppear] = useState(false);
  const dispatch = useDispatch();
  const { accuracy } = useSelector((state) => state.cameraReducer);

  const between = (x, min, max) => {
    return x >= min && x <= max;
  };

  useEffect(() => {
    if (Boolean(accuracy) !== Boolean(rotateAlert)) {
      dispatch({
        type: UPDATE_ACCURACY,
        payload: { isTrue: Boolean(rotateAlert), degree: degree },
      });
    }
  }, [rotateAlert]);

  useEffect(() => {
    if (Platform.OS === "android") {
      const betweenPositiveLandscape = between(degree, 175, 205);
      const betweenNegativeLandscape = between(degree, -25, 25);
      if (!betweenNegativeLandscape && !betweenPositiveLandscape) {
        setAppear(true);
        setAlert({
          svg: <CameraRotate />,
          title: "Adjust your camera angle",
          content:
            "Shooting will continue when the GPS alert icon turns green.",
        });
      } else if (betweenNegativeLandscape || betweenPositiveLandscape) {
        setAppear(false);
        setAlert(null);
      }
    } else if (Platform.OS === "ios") {
      const betweenPositiveLandscape = between(degree, 152, 190);
      const betweenHighNegativeLandscape = between(degree, -190, -160);
      const betweenNegativeLandscape = between(degree, -25, 25);

      if (
        !betweenNegativeLandscape &&
        !betweenPositiveLandscape &&
        !betweenHighNegativeLandscape
      ) {
        setAppear(true);
        setAlert({
          svg: <CameraRotate />,
          title: "Adjust your camera angle",
          content:
            "Shooting will continue when the GPS alert icon turns green.",
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
  }, [degree, setAppear]);

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
                degree < 0
                  ? `${Math.abs(Math.round(Math.ceil(degree / 5) * 5))}deg`
                  : `${-Math.abs(Math.round(Math.ceil(degree / 5) * 5))}deg`,
            },
          ],
        }}
      ></View>
    </View>
  );
};

export default RotationLine;
