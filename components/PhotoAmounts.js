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
  const [availableStorage, setAvailableStorage] = useState(0);

  useEffect(() => {
    FileSystem.getFreeDiskStorageAsync().then((freeDiskStorage) => {
      dispatch({ type: UPDATE_PHONE_MEMORY, payload: freeDiskStorage });
      setMemory(freeDiskStorage);
    });
  }, []);
  
  useEffect(() => {
    setAvailableStorage(parseInt(phoneMemory / imageSize));
  }, [phoneMemory, imageSize]);

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
        {photoAmount}
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
