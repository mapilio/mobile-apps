import Svg, { Circle, G, Path, Rect, Defs, ClipPath } from "react-native-svg";
import { RFValue } from "react-native-responsive-fontsize";
import { Image } from "react-native";

/**
 *
 * @param flag {string ?: "en" | "tr" | "ch" | "fr" | "de" | "it" | "pr" | "es"}
 * @param width
 * @param height
 * @returns {JSX.Element} Returns the JSX Svg component
 * @constructor
 */
const Flags = ({ flag, width = RFValue(20), height = RFValue(12) }) => {
  const iconList = [
    { code: "en", component: require("../../images/languages/england.png") },
    { code: "tr", component: require("../../images/languages/turkey.png") },
    { code: "ch", component: require("../../images/languages/china.png") },
    { code: "fr", component: require("../../images/languages/france.png") },
    { code: "de", component: require("../../images/languages/germany.png") },
    { code: "it", component: require("../../images/languages/italy.png") },
    { code: "pr", component: require("../../images/languages/portugal.png") },
    { code: "es", component: require("../../images/languages/spain.png") },
  ];

  const { component } = iconList.find(({ code }) => code === flag);

  return (
    <Image source={component} style={{ width, height, aspectRatio:1.5 }}  />
  );
};

export default Flags;
