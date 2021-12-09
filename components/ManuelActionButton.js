import React, { useEffect, useState } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { convertHexToRGBA } from "../helper/helper";
import { useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { UPDATE_PHOTO_AMOUNT, UPDATE_IMAGE_SIZE } from "../store/actionsName";
import { useDispatch } from "react-redux";
import uuid from "react-native-uuid";
import Database from "../db";

const ManuelActionButton = ({ disabled }) => {
  const { cameraStatus, camera, selectedProject } = useSelector(
    (status) => status.cameraReducer
  );
  const { userInformation } = useSelector((state) => state.getTokenReducer);
  const [image, setImage] = useState("");
  const [uuidV4, setUUID] = useState("");
  const [photoAmount, setPhotoAmount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const sequenceUUID = uuid.v4();
    setUUID(sequenceUUID);
  }, [selectedProject]);

  const takePicture = async () => {
    const db = Database.getConnection();

    if (cameraStatus !== "READY") return;
    const options = { quality: 1, base64: false, exif: true };
    const image = await camera.takePictureAsync(options);
    const location = await Location.getCurrentPositionAsync();
    const imageUri = image.uri;
    if (!imageUri) return;
    const newPath = `${FileSystem.documentDirectory}/${
      userInformation.id
    }/${Math.random()}.${"jpeg"}`;
    await FileSystem.copyAsync({
      from: imageUri,
      to: newPath,
    });
    image.uri = newPath;
    const JSONExif = JSON.stringify(image.exif);
    const JSONLocation = JSON.stringify(location);

    db.transaction((txn) => {
      txn.executeSql(
        "INSERT INTO captures (exif, location, project_key, organization_name, sequence_uuid) VALUES (?, ?, ?, ?, ?)",
        [JSONExif, JSONLocation, null, null, uuidV4],
        (txn, rs) => {
          // Todo something
        },
        (_, error) => {
          console.log(error);
        }
      );
    });

    db.transaction((txn) => {
      txn.executeSql(
        "SELECT * FROM captures",
        [],
        (_, result) => {
          console.log(result.rows._array);
        },
        (_, error) => {
          console.log(error, 22);
        }
      );
    });

    setPhotoAmount((amount) => amount + 1);
    dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: photoAmount + 1 });
    const fileInfo = await FileSystem.getInfoAsync(newPath);
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
