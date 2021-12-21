import { StyleSheet } from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";

export const mapAttrStyle = StyleSheet.create({
    wrapper: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        height: RFValue(18),
        position: 'absolute',
        zIndex: 5,
        bottom: RFValue(80),
        right: RFValue(25),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: RFPercentage(.25),
     },
    text: {
        paddingRight: RFValue(18.66),
        paddingLeft: RFValue(7.34),
    },
    attr: {
        position: 'absolute',
        top: RFValue(0),
        right: RFValue(-9),
    },
});
