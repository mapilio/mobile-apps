import React from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import { BadGPS, GoodGPS } from "../assets/svg/illustrations";
import { CustomTextMedium } from "../highordercomponents";

const GPSLevel = () => {
    const { GPSAccuracy, GPSStartAccuracy } = useSelector(
        (state) => state.cameraReducer
    );

    return (
        <View
            style={{
                marginBottom: RFValue(-40),
                marginLeft: RFValue(-19),
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            {GPSAccuracy && GPSStartAccuracy ? (
                <>
                    <GoodGPS />
                    <CustomTextMedium
                        style={{
                            color: "#FFFFFF",
                            fontSize: RFValue(14),
                            marginLeft: RFValue(5),
                            marginBottom: RFValue(-2),
                        }}
                    >
                        Good GPS
                    </CustomTextMedium>
                </>
            ) : (
                <>
                    <BadGPS />
                    <CustomTextMedium
                        style={{
                            color: "#FFFFFF",
                            fontSize: RFValue(14),
                            marginLeft: RFValue(5),
                            marginBottom: RFValue(-2),
                        }}
                    >
                        Bad GPS
                    </CustomTextMedium>
                </>
            )}
        </View>
    );
};

export default GPSLevel;

