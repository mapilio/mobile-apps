import React, {useEffect} from "react";
import {View, TouchableOpacity, Alert, Text} from "react-native";
import {userUploadStyles} from "../../styles/userUploadStyle";
import {UserFeed} from "../index";
import {NoUpload, Trash} from "../../assets/svg/illustrations";
import {CustomText} from "../../highordercomponents";
import {SwipeListView} from "react-native-swipe-list-view";
import database from "../../db";
import {useDispatch, useSelector} from "react-redux";
import {UPLOAD_DATA} from "../../store/actionsName";
import * as RNFS from "react-native-fs";
import {RFValue} from "react-native-responsive-fontsize";
import {useTranslation} from "react-i18next";

const List = ({ navigation }) => {
  const {uploadData} = useSelector((status) => status.uploadReducer);
  const {t} = useTranslation("upload");
  const dispatch = useDispatch();

  const deleteSequence = (group_id) => {

    let path = RNFS.DocumentDirectoryPath
    if (uploadData.default_storage_path === 'external') {
      RNFS.getAllExternalFilesDirs().then((dirs) => {
         path = dirs[1]
      })
    }
    database.deleteByGroupID(group_id, async () => {
      await RNFS.unlink(path + `/${group_id}`)
      getData();
    })
  }

  const getData = () => {
    database.getGroupByWithSequenceUUID().then(data => {
      const filteredData = data.filter((item) => {
        if (item.count >= 5) {
          return item
        } else {
          deleteSequence(item.group_id)
        }
      })

      dispatch({type: UPLOAD_DATA, payload: filteredData})
    });
  };

  useEffect(() => getData(), []);

  const deleteRow = (sequence_uuid) => {
    Alert.alert(
      t("are_you_sure"),
      t("delete_message"),
      [
        {
          text: t("yes"),
          onPress: () => deleteSequence(sequence_uuid)
        },
        {
          text: t("no"),
        },
      ]
    );
  };

  const renderItem = (data) => {
    return <View style={userUploadStyles.listItem}>
      <UserFeed key={data.index} data={data.item} navigation={navigation}/>
    </View>;
  };

  const renderHiddenItem = (data) => {
    return <View style={userUploadStyles.listItem}>
      <TouchableOpacity
        style={[userUploadStyles.backRightBtn]}
        onPress={() => deleteRow(data.item.sequence_uuid)}
      >
        <Trash/>
        <CustomText style={userUploadStyles.textWhite}>Delete</CustomText>
      </TouchableOpacity>
    </View>;
  };

  return uploadData.length === 0 ? (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        paddingHorizontal: RFValue(30),
        marginTop: RFValue(130),
      }}
    >
      <NoUpload />
      <Text
        style={{
          fontSize: RFValue(16),
          color: "#4A4A4A",
          textAlign: "center",
          marginTop: RFValue(30),
          fontFamily: "Poppins-SemiBold"
        }}
      >
        {t("no_data.title")}
      </Text>
      <CustomText
        style={{
          fontSize: RFValue(16),
          color: "#4A4A4A",
          marginTop: RFValue(20),
          textAlign: "center",
        }}
      >
        {t("no_data.description")}
      </CustomText>
    </View>
  ) : (
    <SwipeListView
      data={uploadData}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-75}
      previewRowKey={"0"}
      previewOpenValue={-40}
      previewOpenDelay={3000}
    />
  );
};

export default List;
