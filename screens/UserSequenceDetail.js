import {Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {documentDirectory} from "expo-file-system";
import React, {Fragment, useEffect, useState} from "react";
import {RFValue} from "react-native-responsive-fontsize";
import LinearGradient from "react-native-linear-gradient";
import {dateConvert, fetchHandler} from "../helper/helper";
import {useSelector} from "react-redux";
import Config from "react-native-config";
import db from "../db";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {ArrowLeft, ArrowRight, Trash} from "../assets/svg/illustrations";
import {useTranslation} from "react-i18next";
import LogoWatermark from "../assets/svg/illustrations/LogoWatermark";
import {AlertModal} from "../components";

const UserSequenceDetail = ({item, changeImage, deleteHandler}) => {
  const {t} = useTranslation("upload");
  const {id, path, address, exif, location, current, total} = item
  const [imageInfo, setImageInfo] = useState({})
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    Image.getSize(documentDirectory + path, (width, height) => {
      setImageInfo(prev => ({...prev, width: width / 2, height}))
    })

    const date = dateConvert(
      JSON.parse(exif).DateTime
      || JSON.parse(exif).DateTimeOriginal
      || JSON.parse(exif).DateTimeDigitized
      || JSON.parse(exif)["{TIFF}"].DateTime,
      "MMM DD, YYYY - HH:mm"
    )
    setImageInfo(prev => ({...prev, date}))
    !address ? getAddress() : setImageInfo(prev => ({...prev, address}))
  }, []);

  const getAddress = async () => {
    const {latitude, longitude} = JSON.parse(location)
    const {features} = await fetchHandler({
      url: `${Config.SEARCH_API}/reverse?lat=${latitude}&lon=${longitude}`
    })
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
          style={{marginTop: 8}}
        />
      }/>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} contentContainerStyle={{width: imageInfo.width}}>
        <ImageBackground
          source={{uri: documentDirectory + path}}
          style={{width: imageInfo.width, height: imageInfo.height}}
        >
          <LinearGradient
            colors={['transparent', '#00000022', '#00000055', '#00000077', '#000000']}
            style={styles.imageGradient}
          />
        </ImageBackground>
      </ScrollView>
      <View style={styles.infoWrapper}>
        <Text style={styles.address} numberOfLines={1}>
          {imageInfo.address ? imageInfo.address : <AddressPlaceholder/>}
        </Text>

        <Text style={styles.date}>
          {imageInfo.date}
        </Text>
      </View>

      <Fragment>
        <View style={styles.prev}>
          <TouchableOpacity style={styles.prevButton} onPress={() => changeImage("prev")}>
            <ArrowLeft color={'#FFF'}/>
          </TouchableOpacity>
        </View>

        <View style={styles.next}>
          <TouchableOpacity style={styles.nextButton} onPress={() => changeImage("next")}>
            <ArrowLeft color={'#FFF'}/>
          </TouchableOpacity>
        </View>

        <View style={styles.imageCount}>
          <Text style={styles.imageCountText}>
            <Text style={{fontFamily: 'Poppins-SemiBold'}}>{current}</Text> / {total}
          </Text>
        </View>

        <View style={styles.delete}>
          <TouchableOpacity style={styles.deleteButton} onPress={() => setIsDelete(true)}>
            <Trash color={'#FFF'} width={RFValue(17)} height={RFValue(24)} />
            <Text style={styles.deleteText}> {t("delete")}</Text>
          </TouchableOpacity>

          <AlertModal
            visible={isDelete}
            title={t("delete_capture")}
            description={t("delete_message")}
            buttons={{
              cancel: {text: t("no"), onPress: () => setIsDelete(false)},
              confirm: {text: t("yes"), onPress: () => deleteHandler([{id, path}])}
            }}
          />
        </View>

        <View style={styles.watermark}>
          <LogoWatermark />
        </View>
      </Fragment>
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
  header: {},
  title: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  infoWrapper: {
    padding: RFValue(16),
    position: 'absolute',
    bottom: RFValue(40)
  },
  imageGradient: {
    flex: 1,
    marginTop: 'auto'
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
  prev: {
    position: 'absolute',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: RFValue(10),
  },
  prevButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255, .3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  next: {
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: RFValue(10),
  },
  nextButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255, .3)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '180deg'}]
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
    fontFamily: 'Poppins',
    fontSize: RFValue(12)
  },
  delete: {
    position: 'absolute',
    top: RFValue(20),
    right: RFValue(10),
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    fontSize: RFValue(12)
  },
  watermark: {
    position: 'absolute',
    bottom: RFValue(20),
    right: RFValue(10),
  }
})

export default UserSequenceDetail
