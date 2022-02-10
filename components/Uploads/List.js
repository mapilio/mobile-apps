import React, { useEffect } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { userUploadStyles } from "../../styles/userUploadStyle";
import { UserFeed } from "../index";
import { NoUpload, Trash } from "../../assets/svg/illustrations";
import {
  CustomText,
  CustomTextBold,
} from "../../highordercomponents";
import { SwipeListView } from "react-native-swipe-list-view";
import database from "../../db";
import { useDispatch, useSelector } from "react-redux";
import { UPLOAD_DATA } from "../../store/actionsName";
import * as FileSystem from "expo-file-system";
import { RFValue } from "react-native-responsive-fontsize";

const List = ({ navigation }) => {
  const { uploadData } = useSelector((status) => status.uploadReducer);
  const { auth } = useSelector((status) => status.getTokenReducer);
  const dispatch = useDispatch();

  const getData = () => {
    database.query(
      "SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid",
      (_, result) => {
        dispatch({ type: UPLOAD_DATA, payload: result.rows._array });
      }
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteRow = (rowMap, sequence_uuid) => {
    Alert.alert(
      "Are you sure?",
      "Are you sure you want to delete this project",
      [
        {
          text: "Yes",
          onPress: () => {
            database.query(
              `DELETE FROM captures where sequence_uuid = '${sequence_uuid}'`,
              () => {
                FileSystem.deleteAsync(
                  FileSystem.documentDirectory + `${auth.id}/${sequence_uuid}`
                ).then(async () => {
                  await FileSystem.readDirectoryAsync(
                    FileSystem.documentDirectory + `${auth.id}`
                  );
                });
                getData();
              }
            );
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  const renderItem = (data) => (
    <View style={userUploadStyles.listItem}>
      <UserFeed key={data.index} data={data.item} navigation={navigation} />
    </View>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={userUploadStyles.listItem}>
      <TouchableOpacity
        style={[userUploadStyles.backRightBtn]}
        onPress={() => deleteRow(rowMap, data.item.sequence_uuid)}
      >
        <Trash />
        <CustomText style={userUploadStyles.textWhite}>Delete</CustomText>
      </TouchableOpacity>
    </View>
  );

  return uploadData.length === 0 ? (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        paddingHorizontal: RFValue(30),
        marginTop: RFValue(20),
      }}
    >
      <NoUpload />
      <CustomTextBold
        style={{
          fontSize: RFValue(16),
          color: "#4A4A4A",
          textAlign: "center",
          marginTop: RFValue(30),
        }}
      >
        No footage found to upload
      </CustomTextBold>
      <CustomText
        style={{
          fontSize: RFValue(16),
          color: "#4A4A4A",
          marginTop: RFValue(20),
          textAlign: "center",
        }}
      >
        In order to upload, you need to shoot from the 'Capture' section. Your
        footage will appear here.
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
