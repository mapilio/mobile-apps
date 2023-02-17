import {Alert, Dimensions, Image, Modal, Pressable, Text, TouchableOpacity, View} from "react-native";
import * as FileSystem from "expo-file-system";
import styles from './UploadItem.styles';
import {dateConvert, fetchHandler} from "../../helper/helper";
import LinearGradient from "react-native-linear-gradient";
import React, {useEffect, useState} from "react";
import {userFeedStyles} from "../../styles/userProfileStyle";
import {Photos, PointIcon, Trash} from "../../assets/svg/illustrations";
import {Swipeable} from "react-native-gesture-handler";
import {RFValue} from "react-native-responsive-fontsize";
import {Trans, useTranslation} from "react-i18next";
import {ACTIVE_SEQUENCE, UPDATE_SELECTED_IMAGES} from "../../store/actionsName";
import {Routes} from "../../navigator/Routes";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import db from "../../db";
import {length, lineString} from "@turf/turf";
import Config from "react-native-config";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const UploadItem = ({item, deleteFunc}) => {
  const {distanceBetween} = useSelector((state) => state.settingsReducer);
  const {connection} = useSelector((state) => state.generalReducer);
  const [address, setAddress] = useState(item.address);
  const {t} = useTranslation("upload");
  const [score, setScore] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const exif = JSON.parse(item.exif);
  const image = `${FileSystem.documentDirectory + `${item.group_id}/${item.filename}.jpeg`}`

  const calculateScore = async () => {
    const data = await db.getCapturesByGroupID(item.group_id)

    const line = lineString(data.map((capture) => {
      const {longitude, latitude} = JSON.parse(capture.location)

      return [longitude, latitude]
    }))

    const meters = length(line, {units: 'meters'})
    const count = ((meters / distanceBetween) + (item.count / 1000)).toFixed(2)

    setScore(count)
  }

  const getAddress = async () => {
    if (connection.connectionStatus) {
      try {
        const location = JSON.parse(item.location)
        const {features} = await fetchHandler({url: `${Config.SEARCH_API}/reverse?lat=${location.latitude}&lon=${location.longitude}`})
        const {city, country, name, street, state} = features[0]?.properties || {};
        setAddress(street || name || city || state || country || null)
        await db.updateById(item.id, {address: street || name || city || state || country || null})
      } catch {
        await getAddress()
      }
    }
  }

  const goToDetail = () => {
    dispatch({type: ACTIVE_SEQUENCE, payload: item.group_id});
    dispatch({type: UPDATE_SELECTED_IMAGES, payload: []});
    navigation.navigate(Routes.sequences)
  }

  useEffect(() => {
    calculateScore();
    !address && getAddress();
  }, []);


  const renderRightActions = () => {
    return (
      <TouchableOpacity style={styles.deleteAction} onPress={() => deleteFunc(item.group_id)}>
        <Trash width={RFValue(21)} height={RFValue(30)}/>
      </TouchableOpacity>
    )
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
    <Swipeable renderRightActions={renderRightActions} containerStyle={styles.container}>
      <Pressable onPress={goToDetail}>
        <View>
          <LinearGradient
            colors={['#00000000', '#000000BF']}
            angle={90}
            useAngle={true}
            style={styles.imageGradient}
          />

          <Image source={{uri: image}} style={styles.image}/>
          <Text style={styles.count}>{item.count} <Photos color={'#FFF'}/></Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.address} numberOfLines={1}>
            {!address ? <AddressPlaceholder/> : address}
          </Text>

          <View style={userFeedStyles.subInfo}>
            <Text style={styles.date}>
              {dateConvert(
                exif.DateTime || exif.DateTimeOriginal || exif.DateTimeDigitized || exif["{TIFF}"].DateTime,
                "DD MM YYYY - H:mm"
              )}
            </Text>

            <Text style={styles.point}>
              <PointIcon/>
              {" "}
              <Trans
                t={t}
                i18nKey="point"
                values={{count: score}}
                components={[<Text style={styles.bold}/>]}
              />
            </Text>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  )
}

export default UploadItem;
