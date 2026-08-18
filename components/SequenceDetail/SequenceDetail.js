import { Image, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { scoreCalculate } from '../../util/helpers';
import { CheckIcon, PointIcon, Trash } from '../../assets/svg/illustrations';
import styles from './SequenceDetail.styles';
import { RFValue } from 'react-native-responsive-fontsize';
import { Trans, useTranslation } from 'react-i18next';
import Upload from '../Uploads/Upload';
import { dateConvert } from '../../helper/helper';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_SELECTED_IMAGES } from '../../store/actionsName';
import AlertModal from '../AlertModal';
import * as RNFS from '../../util/fs';

const SequenceDetail = ({ sequence, onClick, deleteHandler }) => {
  const { t } = useTranslation('upload');
  const dispatch = useDispatch();
  const [isDelete, setIsDelete] = useState(false);
  const { selectedImages } = useSelector((state) => state.imagesReducer);
  const info = {
    ...JSON.parse(sequence[0].exif),
    address: sequence[0].address,
    group_id: sequence[0].group_id,
  };
  const [sdCardPath, setSdCardPath] = useState(null);

  useEffect(() => {
    scoreCalculate(sequence);
    if (Platform.OS === 'android') {
      RNFS.getRemovableExternalFilesDir().then(setSdCardPath);
    }
  }, []);

  const clearSelections = () => dispatch({ type: UPDATE_SELECTED_IMAGES, payload: [] });

  const selectImage = (item) => {
    const isExist = selectedImages.some((selectedId) => selectedId.id === item.id);

    if (isExist) {
      const filteredImages = selectedImages.filter((selectedID) => selectedID.id !== item.id);
      dispatch({ type: UPDATE_SELECTED_IMAGES, payload: filteredImages });
    } else {
      dispatch({
        type: UPDATE_SELECTED_IMAGES,
        payload: [...selectedImages, { id: item.id, path: item.path }],
      });
    }
  };

  const handleClick = (item) => {
    if (selectedImages.length > 0) {
      selectImage(item);
    } else {
      item.current = sequence.findIndex((seq) => seq.id === item.id) + 1;
      item.total = sequence.length;

      onClick(item);
    }
  };

  const _renderItem = ({ item }) => {
    const path =
      item.default_storage_path === 'internal'
        ? `${RNFS.DocumentDirectoryPath}/${item.path}`
        : sdCardPath
          ? `${sdCardPath}/${item.path}`
          : null;
    const imagePath = path ? `file://${path}` : null;
    const isSelected = selectedImages.some((selectedId) => selectedId.id === item.id);

    return (
      <TouchableOpacity
        item={item}
        style={styles.itemWrapper}
        onPress={() => handleClick(item)}
        onLongPress={() => selectImage(item)}>
        <Image
          source={imagePath ? { uri: imagePath, cache: 'force-cache' } : undefined}
          style={styles.image}
          resizeMode={'cover'}
        />
        {isSelected && (
          <View style={styles.selectedWrapper}>
            <View style={styles.selectedIcon}>
              <CheckIcon />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={styles.score}>
          <PointIcon width={RFValue(22)} height={RFValue(22)} />
          <Text style={styles.scoreText}>
            <Trans t={t} i18nKey="point" values={{ count: scoreCalculate(sequence) }}>
              <Text />
            </Trans>
          </Text>
        </View>

        <Upload group_uuid={info.group_id} buttonStyle={styles.button} />
      </View>

      <View style={styles.content}>
        <Text style={styles.address} numberOfLines={1}>
          {info.address}
        </Text>
        <Text style={styles.date}>
          {dateConvert(
            info.DateTime ||
              info.DateTimeOriginal ||
              info.DateTimeDigitized ||
              info['{TIFF}'].DateTime,
            'MMM DD, YYYY - HH:mm'
          )}
        </Text>

        <BottomSheetFlatList
          data={sequence}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={_renderItem}
        />
        {!!selectedImages.length && (
          <Fragment>
            <Pressable style={styles.clearSelection} onPress={clearSelections}>
              <Text style={styles.clearSelectionText}>{t('clear_selections')}</Text>
            </Pressable>

            <TouchableOpacity style={styles.trashIcon} onPress={() => setIsDelete(true)}>
              <Trash />
            </TouchableOpacity>

            <AlertModal
              visible={isDelete}
              title={t('delete_capture')}
              description={t('delete_message')}
              buttons={{
                cancel: { text: t('no'), onPress: () => setIsDelete(false) },
                confirm: { text: t('yes'), onPress: () => deleteHandler(selectedImages) },
              }}
            />
          </Fragment>
        )}
      </View>
    </View>
  );
};

export default SequenceDetail;
