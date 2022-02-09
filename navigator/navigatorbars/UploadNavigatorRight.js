import React from "react";
import { View } from "react-native";
import { uploadRight } from "../../styles/navigatorBarStyles";
import { Upload } from "../../components/Uploads";
import { useSelector } from "react-redux";

const UploadNavigatorRight = ({ navigation }) => {
  const { uploadData } = useSelector((state) => state.uploadReducer);

  return uploadData.length === 0 ? null : (
    <View style={uploadRight.container}>
      <Upload navigation={navigation} />
    </View>
  );
};

export default UploadNavigatorRight;
