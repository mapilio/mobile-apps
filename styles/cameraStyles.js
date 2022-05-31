import {StyleSheet} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";

export const cameraStyles = StyleSheet.create({
    camera: {
        flex: 1,
        position: "relative",
    },
    notReadyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2E2E2E",
    },
    notReadyText: {
        fontSize: RFValue(16),
        marginTop: RFValue(30),
        color: "#FFFFFF",
    }
});