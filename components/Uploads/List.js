import React, { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, Alert, Text, RefreshControl } from 'react-native';
import { userUploadStyles } from '../../styles/userUploadStyle';
import { UserFeed } from '../index';
import { NoUpload, Trash } from '../../assets/svg/illustrations';
import { CustomText } from '../../highordercomponents';
import { SwipeListView } from 'react-native-swipe-list-view';
import database from '../../db';
import { useDispatch, useSelector } from 'react-redux';
import { UPLOAD_DATA } from '../../store/actionsName';
import * as RNFS from '../../util/fs';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';

const List = ({ navigation }) => {
  const { uploadData } = useSelector((status) => status.uploadReducer);
  const { t } = useTranslation('upload');
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const deleteSequence = async (group_id, defaultStoragePath) => {
    try {
      let path = RNFS.DocumentDirectoryPath;
      if (defaultStoragePath === 'external') {
        path = await RNFS.getRemovableExternalFilesDir();
        if (!path) return false;
      }
      const groupPath = `${path}/${group_id}`;
      if (await RNFS.exists(groupPath)) await RNFS.unlink(groupPath);
      await database.deleteByGroupID(group_id);
      return true;
    } catch {
      return false;
    }
  };

  const getData = () => {
    database
      .getGroupByWithSequenceUUID()
      .then((data) => {
        const filteredData = data.filter((item) => {
          if (item.count >= 5) {
            return item;
          }
          deleteSequence(item.group_id, item.default_storage_path);
        });

        dispatch({ type: UPLOAD_DATA, payload: filteredData });
      })
      .catch(() => {});
  };

  useEffect(() => getData(), []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }, []);

  const deleteRow = (sequence_uuid, defaultStoragePath) => {
    Alert.alert(t('are_you_sure'), t('delete_message'), [
      {
        text: t('yes'),
        onPress: async () => {
          await deleteSequence(sequence_uuid, defaultStoragePath);
          getData();
        },
      },
      {
        text: t('no'),
      },
    ]);
  };

  const renderItem = (data) => {
    return (
      <View style={userUploadStyles.listItem}>
        <UserFeed key={data.index} data={data.item} navigation={navigation} />
      </View>
    );
  };

  const renderHiddenItem = (data) => {
    return (
      <View style={userUploadStyles.listItem}>
        <TouchableOpacity
          style={[userUploadStyles.backRightBtn]}
          onPress={() => deleteRow(data.item.sequence_uuid, data.item.default_storage_path)}>
          <Trash />
          <CustomText style={userUploadStyles.textWhite}>Delete</CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  return uploadData.length === 0 ? (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: RFValue(30),
        marginTop: RFValue(130),
      }}>
      <NoUpload />
      <Text
        style={{
          fontSize: RFValue(16),
          color: '#4A4A4A',
          textAlign: 'center',
          marginTop: RFValue(30),
          fontFamily: 'Poppins-SemiBold',
        }}>
        {t('no_data.title')}
      </Text>
      <CustomText
        style={{
          fontSize: RFValue(16),
          color: '#4A4A4A',
          marginTop: RFValue(20),
          textAlign: 'center',
        }}>
        {t('no_data.description')}
      </CustomText>
    </View>
  ) : (
    <SwipeListView
      data={uploadData}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-75}
      previewRowKey={'0'}
      previewOpenValue={-40}
      previewOpenDelay={3000}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0056F1" />
      }
    />
  );
};

export default List;
