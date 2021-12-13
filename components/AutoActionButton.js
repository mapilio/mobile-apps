import React, { useEffect, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { convertHexToRGBA } from "../helper/helper";
import { PlayIcon, StopIcon } from "../assets/svg/illustrations";
import * as Location from "expo-location";
import Database from "../db";
import * as FileSystem from "expo-file-system";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { UPDATE_AUTOCAPTURE_START, UPDATE_IMAGE_SIZE, UPDATE_PHOTO_AMOUNT } from "../store/actionsName";

const AutoActionButton = ({ disabled, uuid }) => {
  const [autoCapture, setAutoCapture] = useState(false);
  const [photoAmount, setPhotoAmount] = useState(0);
  const { cameraStatus, camera } = useSelector(
    (status) => status.cameraReducer
  );
  const { userInformation } = useSelector((state) => state.getTokenReducer);
  const { selectedProject } = useSelector((status) => status.settingsReducer);
  const dispatch = useDispatch();

  const playHandler = () => {
    dispatch({ type: UPDATE_AUTOCAPTURE_START, payload: !autoCapture });
    setAutoCapture((prevState) => !prevState);
  };

  useEffect(() => {
    if (!autoCapture) return;
    var location = null;
    const watchLocation = async () => {
      location = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
        },
        (location) => {
          // if (!autoCapture && !disabled) return;
          takePicture(location);
        }
      );
    };
    watchLocation();
    return () => {
      location.remove();
    };
  }, [autoCapture, disabled]);

  const takePicture = async (location) => {
    const db = Database.getConnection();
    const id =
      selectedProject === "individual"
        ? userInformation.id
        : selectedProject.id;
    if (cameraStatus !== "READY") return;
    const options = { quality: 1, base64: false, exif: true };
    const image = await camera.takePictureAsync(options);
    const imageUri = image.uri;
    if (!imageUri) return;
    const newPath = `${
      FileSystem.documentDirectory
    }/${id}/${Math.random()}.${"jpeg"}`;
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
        [JSONExif, JSONLocation, null, null, uuid],
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
      disabled={disabled}
      style={{
        width: RFValue(61),
        height: RFValue(61),
        marginBottom: RFValue(-55),
        marginTop: RFValue(35),
      }}
      onPress={playHandler}
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {autoCapture ? <StopIcon /> : <PlayIcon />}
      </View>
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

export default AutoActionButton;
