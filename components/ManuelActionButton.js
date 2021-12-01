import React, { useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { convertHexToRGBA } from "../helper/helper";
import { useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import { UPDATE_PHOTO_AMOUNT, UPDATE_IMAGE_SIZE } from "../store/actionsName";
import { useDispatch } from "react-redux";

const ManuelActionButton = ({ disabled }) => {
  const { cameraStatus, camera } = useSelector(
    (status) => status.cameraReducer
  );
  const [photoAmount, setPhotoAmount] = useState(0);
  const dispatch = useDispatch();

  const takePicture = async () => {
    if (cameraStatus !== "READY") return;
    const options = { quality: 1, base64: false, exif: true };
    const image = await camera.takePictureAsync(options);
    const imageUri = image.uri;
    if (!imageUri) return;
    setPhotoAmount((amount) => amount + 1);
    dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: photoAmount + 1 });
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    dispatch({ type: UPDATE_IMAGE_SIZE, payload: fileInfo.size });
  };

  return (
    <TouchableOpacity
      disabled={false}
      style={{
        width: RFValue(61),
        height: RFValue(61),
        marginBottom: RFValue(-55),
        marginTop: RFValue(35),
      }}
      onPress={takePicture}
    >
      <View
        style={{
          position: "absolute",
          top: "12%",
          left: "12%",
          bottom: "12%",
          right: "12%",
          borderRadius:
            Math.round(
              Dimensions.get("window").width + Dimensions.get("window").height
            ) / 2,
          backgroundColor: "#ffffff",
        }}
      ></View>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          borderWidth: RFValue(5),
          margin: RFValue(-2),
          borderColor: convertHexToRGBA("#FFFFFF", 10),
          borderRadius:
            Math.round(
              Dimensions.get("window").width + Dimensions.get("window").height
            ) / 2,
        }}
      ></View>
    </TouchableOpacity>
  );
};

export default ManuelActionButton;
