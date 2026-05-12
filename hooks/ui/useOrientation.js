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
    if (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT
      || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      || orientation === ScreenOrientation.Orientation.UNKNOWN
    ) {
      setOrientation("LANDSCAPE");
    }
    else {
      setOrientation("PORTRAIT");
    }
  }

  const changeOrientation = ({ orientationInfo }) => {
    const { orientation } = orientationInfo;
    if (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) {
      setOrientation("LANDSCAPE");
    }
    else {
      setOrientation("PORTRAIT");
    }
  };

  useEffect(() => {
    const listener = ScreenOrientation.addOrientationChangeListener(changeOrientation);

    let timer;
    if (timeout) {
      timer = setTimeout(() => {
        ScreenOrientation.getOrientationAsync().then(initialOrientationHandler);
      }, timeout);
    } else {
      ScreenOrientation.getOrientationAsync().then(initialOrientationHandler);
    }

    return () => {
      if (timer) clearTimeout(timer);
      ScreenOrientation.removeOrientationChangeListener(listener);
    };
  }, []);

  return orientation;
};

export default useOrientation;
