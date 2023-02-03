import {Alert, Image, Pressable, Text, TouchableOpacity, View} from "react-native";
import * as FileSystem from "expo-file-system";
import styles from './UploadItem.styles';
import {dateConvert} from "../../helper/helper";
import LinearGradient from "react-native-linear-gradient";
import React from "react";
import {userFeedStyles} from "../../styles/userProfileStyle";
import {Photos, PointIcon, Trash} from "../../assets/svg/illustrations";
import {Swipeable} from "react-native-gesture-handler";
import {RFValue} from "react-native-responsive-fontsize";
import {Trans, useTranslation} from "react-i18next";
import {ACTIVE_SEQUENCE, UPDATE_SELECTED_IMAGES} from "../../store/actionsName";
import {Routes} from "../../navigator/Routes";
import {useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";

const UploadItem = ({item, deleteSequence}) => {
  const {t} = useTranslation("upload");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const image = `${FileSystem.documentDirectory + `${item.group_id}/${item.filename}.jpeg`}`

  const goToDetail = () => {
    dispatch({ type: ACTIVE_SEQUENCE, payload: item.group_id });
    dispatch({ type: UPDATE_SELECTED_IMAGES, payload: [] });
    navigation.navigate(Routes.sequences)
  }

  const renderRightActions = () => {
    const deleteHandler = () => {
      Alert.alert(
        t("are_you_sure"),
        t("delete_message"),
        [
          {text: t("yes"), onPress: () => deleteSequence(item.group_id)},
          {text: t("no")},
        ]
      )
    }

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={deleteHandler}
      >
        <Trash width={RFValue(21)} height={RFValue(30)}/>
      </TouchableOpacity>
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
          <Text style={styles.count}>{item.count} <Photos color={'#FFF'} /></Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.address} numberOfLines={1}>
            {item.address || t("no_address")}
          </Text>

          <View style={userFeedStyles.subInfo}>
            <Text style={styles.date}>
              {dateConvert(
                JSON.parse(item.exif).DateTime || JSON.parse(item.exif).DateTimeOriginal,
                "DD MM YYYY - H:mm"
              )}
            </Text>

            <Text style={styles.point}>
              <PointIcon />
              {" "}
              <Trans
                t={t}
                i18nKey="point"
                values={{count: item.count / 1000}}
                components={[<Text style={styles.bold} />]}
              />
            </Text>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  )
}

export default UploadItem;
