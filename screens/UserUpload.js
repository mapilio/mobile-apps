import React, {Fragment, useEffect} from "react";
import {FlatList} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import {EmptyList, UploadItem} from "../components";
import database from "../db";
import * as FileSystem from "expo-file-system";
import {UPLOAD_DATA} from "../store/actionsName";
import {Upload} from "../components/Uploads";

const UserUpload = () => {
  const {uploadData} = useSelector((status) => status.uploadReducer);
  const dispatch = useDispatch();

  useEffect(() => getData(), []);

  const getData = () => {
    database.getGroupByWithSequenceUUID().then(data => {
      const filteredData = data.filter((item) => {
        if (item.count >= 5) {
          return item
        }

        deleteSequence(item.sequence_uuid)
      })

      dispatch({type: UPLOAD_DATA, payload: filteredData})
    });
  };

  const deleteSequence = (sequence_uuid) => {
    database.deleteBySequenceId(sequence_uuid, async () => {
      await FileSystem.deleteAsync(FileSystem.documentDirectory + `${sequence_uuid}`)
      getData();
    })
  }

  return (
    <Fragment>
      <FocusAwareStatusBar barStyle="dark-content" />

      <FlatList
        data={uploadData}
        ListEmptyComponent={() => <EmptyList />}
        renderItem={({item}) => <UploadItem item={item} deleteSequence={deleteSequence} />}
        keyExtractor={(item) => item.sequence_uuid}
      />

      <Upload />
    </Fragment>
  );
};

export default UserUpload;
