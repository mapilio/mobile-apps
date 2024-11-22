import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';

/**
 * @param {number} timeout - Timeout in milliseconds. If you want to wait for the orientation to change before updating the state, pass a number here.
 * @returns {string} "PORTRAIT" or "LANDSCAPE"
 * @example
 * const orientation = useOrientation();
 * const orientation = useOrientation(1000);
 */
const useOrientation = (timeout) => {
  const initialOrientation = Dimensions.get("window").width > Dimensions.get("window").height ? "LANDSCAPE" : "PORTRAIT";
  const [orientation, setOrientation] = useState(initialOrientation);

  const initialOrientationHandler = (orientation) => {

    console.log("orientation--->", orientation);
    console.log(ScreenOrientation.Orientation);
    if (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) {
      setOrientation("LANDSCAPE");
    }
    else {
      setOrientation("PORTRAIT");
    }
  }

  const changeOrientation = ({ orientationInfo }) => {
    console.log("orientationInfo--->", orientationInfo);
    const { orientation } = orientationInfo;
    if (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) {
      setOrientation("LANDSCAPE");
    }
    else {
      setOrientation("PORTRAIT");
    }
  };

  useEffect(() => {
    if (timeout) {
      const timer = setTimeout(() => {
        ScreenOrientation.getOrientationAsync().then(initialOrientationHandler);
      }, timeout);

      return () => {
        clearTimeout(timer);
      };
    }

    const listener = ScreenOrientation.addOrientationChangeListener(changeOrientation);
    console.log('list',listener);

    return () => {
      ScreenOrientation.removeOrientationChangeListener(listener);
    };
  }, []);

  return orientation;
};

export default useOrientation;
