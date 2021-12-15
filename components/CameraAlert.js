import React from "react";
import {View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {convertHexToRGBA} from "../helper/helper";
import {CustomText} from "../highordercomponents";

const CameraAlert = ({svg, title, content}) => {
    return (
        <View
            style={{
                position: "absolute",
                alignSelf: "center",
                bottom: "25%",
            }}
        >
            <View
                style={{
                    width: RFValue(365),
                    height: RFValue(155),
                    backgroundColor: convertHexToRGBA("#213348", 90),
                    paddingHorizontal: RFValue(18),
                    paddingVertical: RFValue(25),
                    borderRadius: 8,
                    alignItems: "center",
                }}
            >
                {svg}
                <CustomText
                    style={{
                        color: "#FFFFFF",
                        fontSize: RFValue(14),
                        marginBottom: RFValue(15),
                        marginTop: RFValue(15),
                    }}
                >
                    {title}
                </CustomText>
                <CustomText
                    style={{
                        color: "#FFFFFF",
                        fontSize: RFValue(12),
                        textAlign: "center",
                    }}
                >
                    {content}
                </CustomText>
            </View>
        </View>
    );
};

export default CameraAlert;
