import React, { useEffect } from "react";
import {View, TouchableOpacity, Alert, Text} from "react-native";
import { userUploadStyles } from "../../styles/userUploadStyle";
import { UserFeed } from "../index";
import { NoUpload, Trash } from "../../assets/svg/illustrations";
import { CustomText } from "../../highordercomponents";
import { SwipeListView } from "react-native-swipe-list-view";
import database from "../../db";
import { useDispatch, useSelector } from "react-redux";
import { UPLOAD_DATA } from "../../store/actionsName";
import * as FileSystem from "expo-file-system";
import { RFValue } from "react-native-responsive-fontsize";

const List = ({ navigation }) => {
  const { uploadData } = useSelector((status) => status.uploadReducer);
  const dispatch = useDispatch();

  const deleteSequence = (sequence_uuid) => {
    database.deleteBySequenceId(sequence_uuid, async () => {
      await FileSystem.deleteAsync(FileSystem.documentDirectory + `${sequence_uuid}`)
      getData();
    })
  }

  const getData = () => {
    database.getGroupByWithSequenceUUID().then(data => {
      const filteredData = data.filter((item) => {
        if (item.count >= 5) {
          return item
        } else {
          deleteSequence(item.sequence_uuid)
        }
      })

      dispatch({type: UPLOAD_DATA, payload: filteredData})
    });
  };

  useEffect(() => getData(), []);

  const deleteRow = (sequence_uuid) => {
    Alert.alert(
      "Are you sure?",
      "Are you sure you want to delete this project",
      [
        {
          text: "Yes",
          onPress: () => deleteSequence(sequence_uuid)
        },
        {
          text: "No",
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
        No footage found to upload
      </Text>
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
