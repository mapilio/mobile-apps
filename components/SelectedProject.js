import React from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { maxCharacterHandler } from "../helper/helper";
import { CustomTextMedium } from "../highordercomponents";

const SelectedProject = ({ projectName }) => {
    return (
        <View
            style={{
                width: RFValue(200),
                height: RFValue(30),
                backgroundColor: "#1AD971",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: RFValue(15),
            }}
        >
            <CustomTextMedium style={{ fontSize: RFValue(14), color: "#FFFFFF" }}>
                {maxCharacterHandler(projectName, 19)}
            </CustomTextMedium>
        </View>
    );
};

export default SelectedProject;
