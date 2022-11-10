import React, {useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {CustomTextMedium} from "../highordercomponents";
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
    <View style={styles.wrapper}>
      <View style={styles.amountInfo}>
        <CustomTextMedium style={{fontSize: RFValue(14), color: "#1AD971"}}>
          {amount}
        </CustomTextMedium>
        <CustomTextMedium style={{color: "#FFFFFF", fontSize: RFValue(14), marginHorizontal: RFValue(3)}}>
          /
        </CustomTextMedium>
        <CustomTextMedium style={{ color: "#FFFFFF", fontSize: RFValue(14) }}>
          {availableStorage}
        </CustomTextMedium>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    borderColor: '#FFF',
    borderBottomWidth: 1.2,
    borderLeftWidth: 1.2,
    height: RFValue(55),
    width: RFValue(105)
  },
  amountInfo: {
    flexDirection: "row",
    position: "absolute",
    bottom: RFValue(10),
    left: RFValue(10)
  }
})

export default PhotoAmounts;
