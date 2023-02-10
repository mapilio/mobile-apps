import React, {Fragment, useEffect, useState} from "react";
import {
  FlatList,
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import {EmptyList, UploadItem} from "../components";
import * as FileSystem from "expo-file-system";
import {UPLOAD_DATA} from "../store/actionsName";
import {Upload} from "../components/Uploads";
import db from "../db";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import {Trash} from "../assets/svg/illustrations";
import {useTranslation} from "react-i18next";
import {globalStyles} from "../styles/globalStyles";

const {width} = Dimensions.get('window')

const UserUpload = () => {
  const dispatch = useDispatch();
  const {uploadData} = useSelector((status) => status.uploadReducer);
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
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      <MaskedView
        androidRenderingMode={null}
        maskElement={<MaskItem />}
        style={styles.maskedView}
      >
        <FlatList
          scrollEnabled={uploadData.length > 0}
          data={uploadData}
          ListEmptyComponent={<EmptyList/>}
          renderItem={({item}) => <UploadItem item={item} deleteFunc={setDeleteItem}/>}
          keyExtractor={(item) => item.sequence_uuid}
          ListFooterComponent={<View/>}
          ListFooterComponentStyle={{paddingBottom: RFValue(100)}}
        />
      </MaskedView>

      <Upload style={styles.upload} />

      <Modal visible={!!deleteItem} transparent={true}>
        <View style={styles.deleteModal}>
          <View style={styles.deleteModalContent}>
            <View style={styles.trashIcon}>
              <Trash width={RFValue(17)} height={RFValue(24)}/>
            </View>
            <Text style={styles.deleteModalTitle}>
              {t("delete_capture")}
            </Text>
            <Text style={styles.deleteModalDescription}>
              {t("delete_message")}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity disabled={loading} style={styles.actionsButton} onPress={()=> setDeleteItem(undefined)}>
                <Text style={styles.actionsButtonText}>
                  {t("no")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={loading} style={{...styles.actionsButton, ...styles.deleteButton}} onPress={deleteSequence}>
                {loading && <ActivityIndicator color="#fff" />}
                <Text style={{...styles.actionsButtonText, ...styles.deleteButtonText}}>
                  {t("yes")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  deleteModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  deleteModalContent: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: RFValue(70),
    borderRadius: RFValue(10),
    width: width * .9,
    alignSelf: 'center',
    alignItems: 'center',
    padding: RFValue(20),
    ...globalStyles.shadow,
  },
  trashIcon: {
    width: RFValue(40),
    height: RFValue(40),
    backgroundColor: '#D33030',
    borderRadius: RFValue(40),
    marginBottom: RFValue(5),
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteModalTitle:{
    color: '#130C47',
    fontSize: RFValue(18),
    fontFamily: 'Poppins-SemiBold',
    marginVertical: RFValue(5),
  },
  deleteModalDescription: {
    color: '#666666',
    fontSize: RFValue(12),
    fontFamily: 'Poppins',
  },
  actions: {
    flexDirection: 'row',
    marginTop: RFValue(20),
  },
  actionsButton: {
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: RFPercentage(50),
    flex: 1,
    paddingVertical: RFValue(10),
    marginHorizontal: RFValue(5),
  },
  actionsButtonText: {
    alignSelf: 'center',
    color: '#333333',
    fontSize: RFValue(12),
    fontFamily: 'Poppins',
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#666666',
  },
  deleteButtonText: {
    color: '#fff',
  }
})

export default UserUpload;
