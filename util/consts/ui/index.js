import { Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
export const tabHeight = Platform.OS === "android" ? RFValue(60) : RFValue(52);
