import React, {useEffect, useState} from "react";
import { Platform, StyleSheet, View } from 'react-native';
import {RFValue} from "react-native-responsive-fontsize";
import {CustomText, CustomTextBold, CustomTextMedium} from "../highordercomponents";
import {useDispatch, useSelector} from "react-redux";
import {UPDATE_PHONE_MEMORY} from "../store/actionsName";
import * as RNFS from "react-native-fs";
import { NativeModules } from 'react-native';
const {StorageModule} = NativeModules;


const PhotoAmounts = () => {
  const dispatch = useDispatch();
  const {defaultStoragePath} = useSelector((status) => status.settingsReducer);
  const {imageSize, photoAmount} = useSelector((status) => status.cameraReducer);
  const [amount, setPhotoAmount] = useState(0);
  const [availableStorage, setAvailableStorage] = useState(0);

  const calculateStorage = (size) => {
    setAvailableStorage(parseInt(size / imageSize));
    dispatch({ type: UPDATE_PHONE_MEMORY, payload: parseInt(size / imageSize) });
  }

  useEffect(() => {
    if (photoAmount === 1) {
      if (defaultStoragePath === 'external' &&  Platform.OS === 'android') {
        RNFS.getAllExternalFilesDirs()
          .then(paths => {
            const sdCardPath = paths[1]; // The second path is usually the SD card path
            StorageModule.getStorageInfo(sdCardPath).then(({ freeSpace }) => calculateStorage(freeSpace));
          });
      } else {
        RNFS.getFSInfo().then(({ freeSpace }) => calculateStorage(freeSpace));
      }
    }
  }, [photoAmount]);

  useEffect(() => {
    setPhotoAmount(photoAmount);
  }, [photoAmount]);

  return (
      <View style={styles.amountInfo}>
        <CustomTextBold style={{fontSize: RFValue(14), color: "#fff"}}>
          {amount}
        </CustomTextBold>
        <CustomTextMedium style={{color: "#FFFFFF", fontSize: RFValue(14), marginHorizontal: RFValue(3)}}>
          /
        </CustomTextMedium>
        <CustomText style={{ color: "#FFFFFF", fontSize: RFValue(14) }}>
          {availableStorage}
        </CustomText>
      </View>
  );
};

const styles = StyleSheet.create({
  amountInfo: {
    flexDirection: "row",
  }
})

export default PhotoAmounts;
