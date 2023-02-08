import React, {Fragment, useEffect, useState} from "react";
import {FlatList, StyleSheet, Platform} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import {EmptyList, UploadItem} from "../components";
import database from "../db";
import * as FileSystem from "expo-file-system";
import {UPLOAD_DATA} from "../store/actionsName";
import {Upload} from "../components/Uploads";
import db from "../db";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";
import {RFValue} from "react-native-responsive-fontsize";

const UserUpload = () => {
  const dispatch = useDispatch();
  const {uploadData} = useSelector((status) => status.uploadReducer);

  useEffect(() => getData(), []);

  const getData = () => {
    db.getGroupByWithGroupID().then(data => {
      const filteredData = data.filter((item) => {
        if (item.count >= 5) {
          return item
        }

        deleteSequence(item.group_id)
      })

      dispatch({type: UPLOAD_DATA, payload: filteredData})
    })
  };

  const deleteSequence = (group_id) => {
    database.deleteByGroupID(group_id, async () => {
      await FileSystem.deleteAsync(FileSystem.documentDirectory + group_id)
      getData();
    })
  }

  const MaskItem = () => {
    return <LinearGradient style={styles.gradient} colors={['black', 'transparent']} locations={[.75, .95]}/>
  }

  return (
    <Fragment>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      <MaskedView
        androidRenderingMode={null}
        maskElement={<MaskItem />}
        style={styles.maskedView}
      >
        <FlatList
          data={uploadData}
          ListEmptyComponent={() => <EmptyList />}
          renderItem={({item}) => {
            return <UploadItem item={item} deleteSequence={deleteSequence}/>
          }}
          keyExtractor={(item) => item.sequence_uuid}
          contentContainerStyle={styles.conentContainer}
        />
      </MaskedView>

      <Upload style={styles.upload} />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  maskedView: {
    flex: 1,
    width: '100%',
  },
  upload: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent'
  },
  gradient: {
    flex: 1,
    width: '100%'
  },
  conentContainer: {
    paddingTop: RFValue(15),
    paddingBottom: RFValue(100)
  }
})

export default UserUpload;
