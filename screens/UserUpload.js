import React, {Fragment, useEffect, useState} from "react";
import {FlatList} from "react-native";
import {useDispatch} from "react-redux";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import {EmptyList, UploadItem} from "../components";
import database from "../db";
import * as FileSystem from "expo-file-system";
import {UPLOAD_DATA} from "../store/actionsName";
import {Upload} from "../components/Uploads";
import db from "../db";

const UserUpload = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  useEffect(() => getData(), []);

  const getData = () => {
    db.getGroupByWithSequenceUUID().then(data => {
      const filteredData = data.filter((item) => {
        if (item.count >= 5) {
          return item
        }

        deleteSequence(item.sequence_uuid)
      })

      dispatch({type: UPLOAD_DATA, payload: filteredData})
    }).then(() => {
      db.getGroupByWithGroupID().then(data => setData(data));
    })
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
        data={data}
        ListEmptyComponent={() => <EmptyList />}
        renderItem={({item}) => <UploadItem item={item} deleteSequence={deleteSequence} />}
        keyExtractor={(item) => item.sequence_uuid}
      />

      <Upload />
    </Fragment>
  );
};

export default UserUpload;
