import React, {useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {CustomText, CustomTextBold, CustomTextMedium} from "../highordercomponents";
import * as FileSystem from "expo-file-system";
import {useDispatch, useSelector} from "react-redux";
import {UPDATE_PHONE_MEMORY} from "../store/actionsName";

const PhotoAmounts = () => {
  const dispatch = useDispatch();
  const {imageSize, photoAmount} = useSelector((status) => status.cameraReducer);
  const [amount, setPhotoAmount] = useState(0);
  const [availableStorage, setAvailableStorage] = useState(0);

  useEffect(() => {
    if (photoAmount === 1) {
      FileSystem.getFreeDiskStorageAsync().then((freeDiskStorage) => {
        setAvailableStorage(parseInt(freeDiskStorage / imageSize));
        dispatch({type: UPDATE_PHONE_MEMORY, payload: parseInt(freeDiskStorage / imageSize)});
      });
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
