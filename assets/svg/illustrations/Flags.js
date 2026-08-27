import { RFValue } from "react-native-responsive-fontsize";
import { Text } from "react-native";

/**
 *
 * @param flag {string ?: "en" | "tr" | "ch" | "fr" | "de" | "it" | "pr" | "es"}
 * @param width
 * @param height
 * @returns {JSX.Element} Returns the JSX Svg component
 * @constructor
 */
const Flags = ({ flag, width = RFValue(20), height = RFValue(12) }) => {
  return (
    <Text
      accessibilityLabel={`${flag} language`}
      style={{ width, height, fontSize: Math.min(width, height), lineHeight: height }}>
      {flag.toUpperCase()}
    </Text>
  );
};

export default Flags;
