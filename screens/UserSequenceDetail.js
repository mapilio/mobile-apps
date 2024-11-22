import { Dimensions, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, {useEffect, useState} from "react";
import {RFValue} from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import {dateConvert} from "../helper/helper";
import db from "../db";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {ArrowLeft, Trash} from "../assets/svg/illustrations";
import {useTranslation} from "react-i18next";
import LogoWatermark from "../assets/svg/illustrations/LogoWatermark";
import {AlertModal} from "../components";
import {search} from "../util/helpers/api";
import { CustomTextBold } from "../highordercomponents";
import * as RNFS from "react-native-fs";

const UserSequenceDetail = ({item, changeImage, deleteHandler}) => {
  const {t} = useTranslation("upload");
  const {id, path, address, exif, location, current, total} = item
  const [imageInfo, setImageInfo] = useState({})
  const [isDelete, setIsDelete] = useState(false);
  const [sdCardPath, setSdCardPath] = useState(null);
  const documentDirectory = item.default_storage_path === 'internal' ?  `file://${RNFS.DocumentDirectoryPath}` : `file://${sdCardPath}`

  useEffect(() => {
    const date = dateConvert(
      JSON.parse(exif).DateTime
      || JSON.parse(exif).DateTimeOriginal
      || JSON.parse(exif).DateTimeDigitized
      || JSON.parse(exif)["{TIFF}"].DateTime,
      "MMM DD, YYYY - HH:mm"
    )
    setImageInfo(prev => ({...prev, date}))
    !address ? getAddress() : setImageInfo(prev => ({...prev, address}))
    if (Platform.OS === 'android') {
      RNFS.getAllExternalFilesDirs().then((dirs) => {
        if (dirs.length > 0) {
          setSdCardPath(dirs[1]);
        }
      });
    }
  }, []);

  const getAddress = async () => {
    const {latitude, longitude} = JSON.parse(location)
    const {data: {features}} = await search.get(`/reverse?lat=${latitude}&lon=${longitude}`)

    const {city, country, name, street, state} = features[0]?.properties || {};

    setImageInfo(prev => ({...prev, address: street || name || city || state || country || null}))
    await db.updateById(item.id, {address: street || name || city || state || country || null})
  }

  const AddressPlaceholder = () => {
    return (
      <SkeletonPlaceholder children={
        <SkeletonPlaceholder.Item
          width={Dimensions.get('window').width / 2}
          height={20}
          borderRadius={4}
          opacity={0.2}
          style={{marginTop: 8}}
        />
      }/>
    )
  }

  return (
    <View style={styles.container}>
        <ImageBackground
          source={{uri: `${documentDirectory}/${path}`}}
          style={{flex:1}}
          resizeMode={'cover'}
          progressiveRenderingEnabled
          defaultSource={{
            uri : `${documentDirectory}/${path}`,
          }}
        >
          <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"]}
          style={[styles.gradientBackground, {bottom:0,height:"100%"}]}
          />
           <LinearGradient
          colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0)"]}
          style={[styles.gradientBackground, {top:0,height:"25%"}]}
          />
        </ImageBackground>
      <View style={styles.infoWrapper}>
        <Text style={styles.address} numberOfLines={1}>
          {imageInfo.address ? imageInfo.address : <AddressPlaceholder/>}
        </Text>

        <Text style={styles.date}>
          {imageInfo.date}
        </Text>
      </View>

          <TouchableOpacity style={[styles.buttonBase, styles.leftButton]} onPress={() => changeImage("prev")}>
            <ArrowLeft  width={RFValue(15)} height={RFValue(15)} color={'#FFF'}/>
          </TouchableOpacity>

          <TouchableOpacity  style={[styles.buttonBase, styles.rightButton]} onPress={() => changeImage("next")}>
            <ArrowLeft  width={RFValue(15)} height={RFValue(15)} color={'#FFF'}/>
          </TouchableOpacity>

        <View style={styles.imageCount}>
          <CustomTextBold style={styles.imageCountText}>
            {current}  / {total}
          </CustomTextBold>
        </View>

        <View style={[styles.buttonBase, styles.deleteButton]}>
          <TouchableOpacity onPress={() => setIsDelete(true)}>
            <Trash color={'#FFF'} width={RFValue(20)} height={RFValue(20)} />
          </TouchableOpacity>
        </View>

          <AlertModal
            visible={isDelete}
            title={t("delete_capture")}
            description={t("delete_message")}
            buttons={{
              cancel: {text: t("no"), onPress: () => setIsDelete(false)},
              confirm: {text: t("yes"), onPress: () => deleteHandler([{id, path}])}
            }}
          />

        <View style={styles.watermark}>
          <LogoWatermark />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: RFValue(10),
    borderTopRightRadius: RFValue(10),
    width: Dimensions.get('screen').width,
    overflow: 'hidden',
    position: 'relative',
  },
  title: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  infoWrapper: {
    padding: RFValue(16),
    position: 'absolute',
    bottom: RFValue(30)
  },
  gradientBackground:{
    position: "absolute",
    left: 0,
    right: 0,
  },
  buttonBase:{
    position: "absolute",
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: RFValue(10),
    borderRadius: RFValue(50),
  },
    leftButton: {
    top: "45%",
    left: RFValue(10),
  },
    rightButton: {
    top: "45%",
    right: RFValue(10),
    transform: [{ rotateY: "180deg" }],
  },
  address: {
    fontSize: RFValue(16),
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF'
  },
  date: {
    fontSize: RFValue(12),
    fontFamily: 'Poppins',
    color: '#C2C2C2'
  },
  imageCount: {
    position: 'absolute',
    top: RFValue(20),
    left: 0,
    right: 0,
  },
  imageCountText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: RFValue(16)
  },
  deleteButton: {
    top: RFValue(10),
    right: RFValue(10),
  },
  watermark: {
    position: 'absolute',
    bottom: RFValue(20),
    marginLeft: RFValue(16),
  }
})

export default UserSequenceDetail
