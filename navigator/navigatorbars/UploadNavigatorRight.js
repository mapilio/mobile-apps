import React from "react";
import { View } from "react-native";
import { UploadIcon } from "../../assets/svg/illustrations";
import { uploadRight } from "../../styles/navigatorBarStyles";

const UploadNavigatorRight = () => (
  <View style={uploadRight.container}>
    <UploadIcon />
  </View>
);

export default UploadNavigatorRight;
