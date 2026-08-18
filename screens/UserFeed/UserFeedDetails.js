import { View, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { api } from '../../util/helpers/api';
import { CustomText, CustomTextBold, MapView } from '../../highordercomponents';
import { RFValue } from 'react-native-responsive-fontsize';
import { dateConvert, maxCharacterHandler } from '../../helper/helper';
import { setGeoJson } from '../../helper/geojson';
import { styles as mapStyles } from '../../styles/circleStyles';
import { bbox } from '@turf/turf';
import { ArrowLeft } from '../../assets/svg/illustrations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ActiveImage from '../../components/UserFeed/ActiveImage';
import { Heading } from '../../components/Map';
import { FocusAwareStatusBar } from '../../components';
import { useTranslation } from 'react-i18next';
import ListImage from '../../components/UserFeed/ListImage';

const UserFeedDetails = ({ route }) => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation('profile');
  const { id, user_id, start_address, capture_time } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [mapData, setMapData] = useState({
    sequenceData: [],
    points: {},
    lines: {},
    bbox: [],
  });

  const [activeImage, setActiveImage] = useState(null);
  const bottomSheetRef = useRef(null);
  const cameraRef = useRef(null);

  const getData = async () => {
    const linesRes = await api
      .get('/api/get-uploaded-roads-group?group_key=' + id)
      .then((res) => res.data);

    await api
      .get(
        `/api/user-uploads-detail-v2?options[parameters][user_id]=${user_id}&options[parameters][group_key]=${id}&options[limit]=3000&page=1`
      )
      .then((res) => {
        setMapData({
          sequenceData: res.data,
          points: setGeoJson(res.data, 'point'),
          lines: linesRes,
          bbox: bbox(setGeoJson(res.data, 'line')),
          totalPhotos: res.data.length,
        });
        cameraRef.current?.setCamera({
          bounds: {
            ne: [parseFloat(res.data[0].longitude), parseFloat(res.data[0].latitude)],
            sw: [
              parseFloat(res.data[res.data.length - 1].longitude),
              parseFloat(res.data[res.data.length - 1].latitude),
            ],
            paddingTop: 100,
            paddingBottom: 400,
            paddingLeft: 100,
            paddingRight: 100,
          },
          animationDuration: 300,
        });
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const snapPoints = useMemo(() => {
    return activeImage ? ['40%'] : ['40%', '80%'];
  }, [activeImage]);

  const handleBack = () => {
    if (activeImage) {
      setActiveImage(null);
    } else {
      navigation.goBack();
    }
  };

  const BackButton = () => {
    return (
      <TouchableOpacity
        style={{
          ...styles.base,
          top: top + RFValue(20),
        }}
        onPress={handleBack}>
        <ArrowLeft width={RFValue(18)} height={RFValue(18)} />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (activeImage) {
      cameraRef.current.setCamera({
        centerCoordinate: [parseFloat(activeImage.longitude), parseFloat(activeImage.latitude)],
        animationDuration: 300,
      });
    }
  }, [activeImage]);

  const changeImage = (type) => {
    const index = mapData.sequenceData.findIndex(({ id }) => id === activeImage.id);
    const newIndex = type === 'next' ? index + 1 : index - 1;

    if (newIndex < 0 || newIndex > mapData.sequenceData.length - 1) return;

    setActiveImage({
      img_code: mapData.sequenceData[newIndex].img_code,
      filename: mapData.sequenceData[newIndex].filename,
      id: mapData.sequenceData[newIndex].id,
      longitude: mapData.sequenceData[newIndex].longitude,
      latitude: mapData.sequenceData[newIndex].latitude,
      heading: mapData.sequenceData[newIndex].heading,
      capture_time: mapData.sequenceData[newIndex].capture_time,
    });
  };

  const hideToast = () => toast.hideAll();
  const showToast = (message, options) => toast.show(message, options);

  const onImagePress = (item) => {
    bottomSheetRef.current?.snapToIndex(0);
    setActiveImage({
      img_code: item.img_code,
      filename: item.filename,
      id: item.id,
      longitude: item.longitude,
      latitude: item.latitude,
      heading: item.heading,
      capture_time: item.capture_time,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <BackButton />
      <Modal
        statusBarTranslucent={Platform.OS === 'android'}
        visible={modalVisible}
        supportedOrientations={['landscape']}
        presentationStyle="fullScreen"
        animationType={Platform.OS === 'ios' ? 'slide' : 'fade'}>
        {activeImage && (
          <ActiveImage
            imgCode={activeImage.img_code}
            filename={activeImage.filename}
            captureDate={activeImage.capture_time}
            sequenceName={start_address}
            changeImage={changeImage}
            imageID={activeImage.id}
            isFullScreen
            showToast={showToast}
            hideToast={hideToast}
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
            totalImages={mapData.sequenceData.length}
            activeImageIndex={mapData.sequenceData.findIndex(({ id }) => id === activeImage.id)}
          />
        )}
      </Modal>
      <MapView style={{ flex: 1 }} isAttributionsEnabled={false} pitchEnabled={false}>
        <MapLibreGL.Camera ref={cameraRef} animationDuration={500} />
        {mapData.bbox.length > 0 && (
          <Fragment>
            {mapData?.lines?.map((line, index) => (
              <MapLibreGL.ShapeSource
                id={'LineShape' + index}
                shape={JSON.parse(line.linefeature)}
                key={index}>
                <MapLibreGL.LineLayer id={'LineLayer' + index} style={mapStyles.lineStyles} />
              </MapLibreGL.ShapeSource>
            ))}
            <MapLibreGL.ShapeSource
              id={'PointShape'}
              shape={mapData?.points}
              onPress={(e) => {
                setActiveImage({
                  img_code: e.features[0].properties.item.img_code,
                  filename: e.features[0].properties.item.filename,
                  id: e.features[0].properties.item.id,
                  longitude: e.features[0].properties.item.longitude,
                  latitude: e.features[0].properties.item.latitude,
                  heading: e.features[0].properties.item.heading,
                  capture_time: e.features[0].properties.item.capture_time,
                });
              }}>
              <MapLibreGL.CircleLayer id="pointLayer" style={mapStyles.circles} />
            </MapLibreGL.ShapeSource>
          </Fragment>
        )}
        {activeImage && (
          <Heading
            coordinates={[parseFloat(activeImage.longitude), parseFloat(activeImage.latitude)]}
            heading={activeImage.heading}
            markerPath={require('../../assets/images/heading.png')}
          />
        )}
      </MapView>

      <BottomSheet
        snapPoints={snapPoints}
        index={0}
        ref={bottomSheetRef}
        handleStyle={{ display: 'none' }}>
        {activeImage && (
          <ActiveImage
            imgCode={activeImage.img_code}
            filename={activeImage.filename}
            captureDate={activeImage.capture_time}
            sequenceName={start_address}
            changeImage={changeImage}
            setModalVisible={setModalVisible}
            imageID={activeImage.id}
            modalVisible={modalVisible}
            totalImages={mapData.sequenceData.length}
            activeImageIndex={mapData.sequenceData.findIndex(({ id }) => id === activeImage.id)}
          />
        )}

        <View style={{ zIndex: 2, height: RFValue(20) }}>
          <View style={styles.indicator} />
        </View>

        <View style={styles.listWrapper}>
          <CustomTextBold style={styles.h1} adjustFontSize={false}>
            {start_address ? maxCharacterHandler(start_address, 30) : t('no_address')}
          </CustomTextBold>
          <CustomText style={styles.h2} adjustFontSize={false}>
            {capture_time ? dateConvert(capture_time, 'MMM DD, YYYY - HH:mm') : null}
          </CustomText>
          <BottomSheetFlatList
            data={mapData.sequenceData}
            numColumns={3}
            disableIntervalMomentum={true}
            pagingEnabled={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            keyExtractor={(item) => item.id}
            style={styles.listContent}
            renderItem={({ item }) => <ListImage item={item} onPress={onImagePress} />}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(8),
    borderRadius: RFValue(20),
    left: RFValue(20),
    zIndex: 2,
  },
  activeImageWrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 100,
    backgroundColor: '#fff',
  },
  listWrapper: {
    paddingTop: RFValue(10),
    paddingLeft: RFValue(10),
    flex: 1,
  },
  listContent: {
    flex: 1,
    marginTop: RFValue(10),
    paddingRight: RFValue(10),
  },
  indicator: {
    width: RFValue(40),
    height: RFValue(3),
    backgroundColor: '#ccc',
    borderRadius: RFValue(5),
    alignSelf: 'center',
    marginTop: RFValue(10),
  },
  h1: { color: '#333333', fontSize: RFValue(16) },
  h2: { color: '#666666', fontSize: RFValue(12) },
});
export default UserFeedDetails;
