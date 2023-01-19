import {Alert, Image, Pressable, Text, TouchableOpacity, View} from "react-native";
import * as FileSystem from "expo-file-system";
import styles from './UploadItem.styles';
import {dateConvert} from "../../helper/helper";
import LinearGradient from "react-native-linear-gradient";
import React from "react";
import {userFeedStyles} from "../../styles/userProfileStyle";
import {Photos, Trash} from "../../assets/svg/illustrations";
import {Swipeable} from "react-native-gesture-handler";
import {RFValue} from "react-native-responsive-fontsize";
import {useTranslation} from "react-i18next";
import {ACTIVE_SEQUENCE, UPDATE_SELECTED_IMAGES} from "../../store/actionsName";
import {Routes} from "../../navigator/Routes";
import {useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";

const UploadItem = ({item, deleteSequence}) => {
  const {t} = useTranslation("upload");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const image = `${FileSystem.documentDirectory + `${item.sequence_uuid}/${item.filename}.jpeg`}`

  const goToDetail = () => {
    dispatch({ type: ACTIVE_SEQUENCE, payload: item.sequence_uuid });
    dispatch({ type: UPDATE_SELECTED_IMAGES, payload: [] });
    navigation.navigate(Routes.sequences)
  }

  const renderRightActions = () => {
    const deleteHandler = () => {
      Alert.alert(
        t("are_you_sure"),
        t("delete_message"),
        [
          {text: t("yes"), onPress: () => deleteSequence(item.sequence_uuid)},
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
        <View style={styles.imageContainer}>
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
            {/* TODO: The sequence start address will be added to this field. */}
            {" "}
          </Text>

          <View style={userFeedStyles.subInfo}>
            <Text style={styles.date}>
              {dateConvert(
                JSON.parse(item.exif).DateTime || JSON.parse(item.exif).DateTimeOriginal,
                "DD MM YYYY - H:mm"
              )}
            </Text>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  )
}

export default UploadItem;
