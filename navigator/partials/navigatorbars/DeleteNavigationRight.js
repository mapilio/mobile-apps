import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as RNFS from 'react-native-fs';
import db from '../../../db';
import { CustomText } from '../../../highordercomponents';
import { deleteRight } from '../../../styles/navigatorBarStyles';
import { Trash } from '../../../assets/svg/illustrations';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../Routes';
import { UPLOAD_DATA } from '../../../store/actionsName';
import { useTranslation } from 'react-i18next';

const DeleteNavigationRight = () => {
  const { t } = useTranslation('navigation');

  const { rank } = useSelector((state) => state.uploadReducer);
  const { activeSequence } = useSelector((state) => state.uploadReducer);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const deleteHandler = () => {
    RNFS.unlink(rank.path).then(() => {
      db.deleteById(rank.id).then(() => {
        db.getGroupByWithSequenceUUID().then((data) => {
          dispatch({ type: UPLOAD_DATA, payload: data });

          const isSequence = data.map((item) => item.sequence_uuid === activeSequence);

          isSequence.length
            ? navigation.navigate(Routes.sequences)
            : navigation.navigate(Routes.upload);
        });
      });
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          Alert.alert(t('are_you_sure'), t('delete_photo'), [
            { text: t('yes'), onPress: () => deleteHandler() },
            { text: t('no') },
          ]);
        }}>
        <CustomText style={deleteRight.text}>
          <Trash width={16.56} height={20.32} color={'#000'} /> {t('delete')}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteNavigationRight;
