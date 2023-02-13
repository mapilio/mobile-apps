import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

/**
 * @param {number} timeout - Timeout in milliseconds. If you want to wait for the orientation to change before updating the state, pass a number here.
 * @returns {string} "PORTRAIT" or "LANDSCAPE"
 * @example
 * const orientation = useOrientation();
 * const orientation = useOrientation(1000);
 */
const useOrientation = (timeout) => {
  const initialOrientation =
    Dimensions.get("window").width < Dimensions.get("window").height
      ? "PORTRAIT"
      : "LANDSCAPE";

  const [orientation, setOrientation] = useState(initialOrientation);

  const changeOrientation = ({ window: { width, height } }) => {
    const isPortrait = width < height;

    if (timeout) {
      setTimeout(() => {
        setOrientation(isPortrait ? "PORTRAIT" : "LANDSCAPE");
      }, timeout);
    } else {
      setOrientation(isPortrait ? "PORTRAIT" : "LANDSCAPE");
    }
  };

  useEffect(() => {
    const listener = Dimensions.addEventListener("change", changeOrientation);

    return () => {
      listener.remove();
    };
  }, []);

  return orientation;
};

export default useOrientation;
