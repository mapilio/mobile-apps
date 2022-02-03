import React, { useState } from "react";
import {Dimensions, Image, Platform, TouchableOpacity, View} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { convertHexToRGBA } from "../helper/helper";
import { useDispatch, useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { UPDATE_IMAGE_SIZE, UPDATE_PHOTO_AMOUNT } from "../store/actionsName";
import Database from "../db";

const ManuelActionButton = ({ disabled, uuid }) => {
  const { cameraStatus, camera } = useSelector(
    (status) => status.cameraReducer
  );
  const { selectedProject } = useSelector((status) => status.settingsReducer);
  const { userInformation } = useSelector((state) => state.getTokenReducer);
  const [image, setImage] = useState("");
  const [photoAmount, setPhotoAmount] = useState(0);
  const dispatch = useDispatch();

  // TODO ADD TO HELPER.JS
  const takePicture = async () => {
    const db = Database.getConnection();
    const id =
      selectedProject.type === "individual"
        ? userInformation.id
        : selectedProject.id;

    if (cameraStatus !== "READY") return;
    const options = { quality: 0.6, base64: false, exif: true };
    const image = await camera.takePictureAsync(options);
    const location = await Location.getCurrentPositionAsync();
    const heading = await Location.getHeadingAsync();
    const imageUri = image.uri;
    if (!imageUri) return;
    const path =  Platform.OS === 'android' ? `${id}/${uuid}/${Math.random().toString()}.${"jpeg"}` : `${id}${uuid}${Math.random().toString()}.${"jpeg"}` ;
    const newPath = FileSystem.documentDirectory + path;

    await FileSystem.copyAsync({
      from: imageUri,
      to: newPath,
    });
    image.uri = newPath;
    location.coords.heading = heading.trueHeading;
    const JSONExif = JSON.stringify(image.exif);
    const JSONLocation = JSON.stringify(location);

    // TODO PROJECT KEY AND ORG NAME ARE CONNECTED TO VARIABLE WHEN THE API IS COMING
    Database.insertToDB({
      JSONExif,
      JSONLocation,
      projectKey: null,
      organizationName: null,
      uuid,
      path: newPath,
      userID: userInformation.id,
    });

    setPhotoAmount((amount) => amount + 1);
    dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: photoAmount + 1 });
    const fileInfo = await FileSystem.getInfoAsync(newPath);
    dispatch({ type: UPDATE_IMAGE_SIZE, payload: fileInfo.size });
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        width: RFValue(61),
        height: RFValue(61),
        marginBottom: RFValue(-55),
        marginTop: RFValue(35),
      }}
      onPress={takePicture}
    >
      {image.length !== 0 && (
        <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />
      )}
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
      />
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
      />
    </TouchableOpacity>
  );
};

export default ManuelActionButton;
