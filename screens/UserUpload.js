import React, {Fragment, useEffect, useState} from "react";
import {FlatList, StyleSheet, View, Dimensions} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import {AlertModal, EmptyList, UploadItem} from "../components";
import * as FileSystem from "expo-file-system";
import {UPLOAD_DATA} from "../store/actionsName";
import {Upload} from "../components/Uploads";
import db from "../db";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";
import {RFValue} from "react-native-responsive-fontsize";
import {useTranslation} from "react-i18next";

const UserUpload = () => {
  const dispatch = useDispatch();
  const {uploadData} = useSelector((status) => status.uploadReducer);
  const {mapShown} = useSelector((status) => status.generalReducer);
  const [deleteItem, setDeleteItem] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation("upload");

  useEffect(() => getData(), []);

  const getData = () => {
    db.getGroupByWithGroupID().then(data => dispatch({type: UPLOAD_DATA, payload: data}))
  };

  const resetToDefault = () => {
    getData()
    setDeleteItem(undefined)
    setLoading(false)
  }

  const deleteSequence = () => {
    setLoading(true)

    db.deleteByGroupID(deleteItem, () => {
      FileSystem.deleteAsync(FileSystem.documentDirectory + deleteItem).then(() => resetToDefault()).catch(() => resetToDefault())
    }, () => resetToDefault())
  }

  const MaskItem = () => (
    <LinearGradient
      style={styles.gradient}
      colors={['black', uploadData.length ? 'transparent' : 'black']}
      locations={[.75, .95]}
    />
  )

  return (
    <Fragment>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true}/>

      <MaskedView
        androidRenderingMode={null}
        maskElement={<MaskItem/>}
        style={styles.maskedView}
      >
        <FlatList
          scrollEnabled={uploadData.length > 0}
          data={uploadData}
          ListEmptyComponent={<EmptyList/>}
          renderItem={({item}) => mapShown ? <UploadItem item={item} deleteFunc={setDeleteItem}/> : null}
          keyExtractor={(item) => item.sequence_uuid}
          ListFooterComponent={<View/>}
          ListFooterComponentStyle={{paddingBottom: RFValue(100)}}
        />
      </MaskedView>

      <Upload style={styles.upload}/>

      <AlertModal
        visible={!!deleteItem}
        title={t("delete_capture")}
        description={t("delete_message")}
        loading={loading}
        buttons={{
          cancel: {text: t("no"), onPress: () => setDeleteItem(undefined)},
          confirm: {text: t("yes"), onPress: deleteSequence,}
        }}
      />
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
  }
})

export default UserUpload;
