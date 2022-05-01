import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomTextMedium } from "../highordercomponents";
import * as FileSystem from "expo-file-system";
import { useDispatch } from "react-redux";
import { UPDATE_PHONE_MEMORY } from "../store/actionsName";
import { useSelector } from "react-redux";

const PhotoAmounts = () => {
  const dispatch = useDispatch();
  const { imageSize, photoAmount } = useSelector(
    (status) => status.cameraReducer
  );
  const [phoneMemory, setMemory] = useState(0);
  const [amount, setPhotoAmount] = useState(0);
  const [availableStorage, setAvailableStorage] = useState(0);

  useEffect(() => {
    if (photoAmount === 1) {
      FileSystem.getFreeDiskStorageAsync().then((freeDiskStorage) => {
        setMemory(freeDiskStorage);
        setAvailableStorage(parseInt(freeDiskStorage / imageSize));
        dispatch({
          type: UPDATE_PHONE_MEMORY,
          payload: parseInt(freeDiskStorage / imageSize),
        });
      });
    }
  }, [photoAmount]);

  useEffect(() => {
    console.log(photoAmount, "TEST");
    setPhotoAmount(photoAmount);
  }, [photoAmount]);

  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: RFValue(-45),
        marginLeft: RFValue(18),
      }}
    >
      <CustomTextMedium
        style={{
          fontSize: RFValue(14),
          color: "#1AD971",
        }}
      >
        {amount}
      </CustomTextMedium>
      <CustomTextMedium
        style={{
          color: "#FFFFFF",
          fontSize: RFValue(14),
          marginHorizontal: RFValue(3),
        }}
      >
        /
      </CustomTextMedium>
      <CustomTextMedium style={{ color: "#FFFFFF", fontSize: RFValue(14) }}>
        {availableStorage}
      </CustomTextMedium>
    </View>
  );
};

export default PhotoAmounts;
