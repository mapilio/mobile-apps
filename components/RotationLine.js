import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { CameraRotate } from "../assets/svg/illustrations";
import * as Animatable from "react-native-animatable";

const RotationLine = ({ degree, setAlert }) => {
  const [appear, setAppear] = useState(false);

  const between = (x, min, max) => {
    return x >= min && x <= max;
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      const betweenPositiveLandscape = between(degree, 165, 195);
      const betweenNegativeLandscape = between(degree, -15, 15);
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
      const betweenPositiveLandscape = between(degree, 162, 180);
      const betweenHighNegativeLandscape = between(degree, -180, -170);
      const betweenNegativeLandscape = between(degree, -15, 15);
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
      <Animatable.View
        easing={"ease-in-out-sine"}
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
      ></Animatable.View>
    </View>
  );
};

export default RotationLine;
