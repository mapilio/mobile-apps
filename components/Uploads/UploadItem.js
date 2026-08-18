import { Dimensions, Image, Text, Pressable, View, Platform } from 'react-native';
import * as RNFS from '../../util/fs';
import styles from './UploadItem.styles';
import { dateConvert } from '../../helper/helper';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { userFeedStyles } from '../../styles/userProfileStyle';
import { Photos, PointIcon, Trash } from '../../assets/svg/illustrations';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { Trans, useTranslation } from 'react-i18next';
import { ACTIVE_SEQUENCE, UPDATE_SELECTED_IMAGES } from '../../store/actionsName';
import { Routes } from '../../navigator/Routes';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import db from '../../db';
import SkeletonPlaceholder from '../Skeleton';
import { scoreCalculate } from '../../util/helpers';
import { search } from '../../util/helpers/api';

const UploadItem = ({ item, deleteFunc }) => {
  const { connection } = useSelector((state) => state.generalReducer);
  const [address, setAddress] = useState(item.address);
  const { t } = useTranslation('upload');
  const [score, setScore] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const exif = JSON.parse(item.exif);
  const [sdCardPath, setSdCardPath] = useState(null);
  const image =
    item.default_storage_path === 'internal'
      ? `file://${RNFS.DocumentDirectoryPath}/${item.group_id}/${item.filename}.jpeg`
      : sdCardPath
        ? `file://${sdCardPath}/${item.group_id}/${item.filename}.jpeg`
        : null;

  const calculateScore = async () => {
    const data = await db.getCapturesByGroupID(item.group_id);
    setScore(scoreCalculate(data));
  };

  const getAddress = async () => {
    if (connection.connectionStatus) {
      try {
        const { latitude, longitude } = JSON.parse(item.location);

        const {
          data: { features },
        } = await search.get(`/reverse?lat=${latitude}&lon=${longitude}`);

        const { city, country, name, street, state } = features[0]?.properties || {};
        setAddress(street || name || city || state || country || null);
        await db.updateById(item.id, {
          address: street || name || city || state || country || null,
        });
      } catch {
        await getAddress();
      }
    }
  };

  const goToDetail = () => {
    dispatch({ type: ACTIVE_SEQUENCE, payload: item.group_id });
    dispatch({ type: UPDATE_SELECTED_IMAGES, payload: [] });
    navigation.navigate(Routes.sequences);
  };

  useEffect(() => {
    calculateScore();
    !address && getAddress();
    if (Platform.OS === 'android') {
      RNFS.getRemovableExternalFilesDir().then(setSdCardPath);
    }
  }, []);

  const renderRightActions = () => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.deleteAction,
          {
            backgroundColor: pressed ? '#9C0E0E' : '#D33030',
          },
        ]}
        onPress={() =>
          deleteFunc({
            group_id: item.group_id,
            default_storage_path: item.default_storage_path,
          })
        }>
        <Trash width={RFValue(21)} height={RFValue(30)} />
      </Pressable>
    );
  };

  const AddressPlaceholder = () => {
    return (
      <SkeletonPlaceholder
        children={
          <SkeletonPlaceholder.Item
            width={Dimensions.get('window').width / 2}
            height={20}
            borderRadius={4}
            style={{ marginTop: 8 }}
          />
        }
      />
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      containerStyle={styles.container}
      overshootRight={false}
      useNativeAnimations>
      <RectButton onPress={goToDetail}>
        <View>
          <LinearGradient
            colors={['#00000000', '#000000BF']}
            angle={90}
            useAngle={true}
            style={styles.imageGradient}
          />

          <Image source={image ? { uri: image } : undefined} style={styles.image} />
          <Text style={styles.count}>
            {item.count} <Photos color={'#FFF'} />
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.address} numberOfLines={1}>
            {!address ? <AddressPlaceholder /> : address}
          </Text>

          <View style={userFeedStyles.subInfo}>
            <Text style={styles.date}>
              {dateConvert(
                exif.DateTime ||
                  exif.DateTimeOriginal ||
                  exif.DateTimeDigitized ||
                  exif['{TIFF}'].DateTime,
                'MMM DD, YYYY - HH:mm'
              )}
            </Text>

            <Text style={styles.point}>
              <PointIcon />{' '}
              <Trans
                t={t}
                i18nKey="point"
                values={{ count: score }}
                components={[<Text style={styles.bold} />]}
              />
            </Text>
          </View>
        </View>
      </RectButton>
    </Swipeable>
  );
};

export default UploadItem;
