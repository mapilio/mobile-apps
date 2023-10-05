import { View, TouchableOpacity, Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { CustomTextBold, CustomText } from '../../highordercomponents';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Fragment, useRef, useMemo, useCallback, useState } from 'react';
import CustomFooter from './CustomFooter';
import BadgeInfo from './BadgeInfo';

const Badges = ({ badgeDetails }) => {
  const bottomSheetRef = useRef(null);
  const [selectedBadgeDetails, setSelectedBadgeDetails] = useState(null);

  const snapPoints = useMemo(
    () => (selectedBadgeDetails ? ['45%'] : ['45%', '90%']),
    [selectedBadgeDetails]
  );

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop {...props} opacity={0.4} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    []
  );

  const onFooterPress = () => {
    if (selectedBadgeDetails) {
      setSelectedBadgeDetails(null);
    } else {
      bottomSheetRef.current?.close();
    }
  };

  const onBadgeSelect = (badgeDetails) => {
    setSelectedBadgeDetails(badgeDetails);
    bottomSheetRef.current?.snapToIndex(0);
  };

  if (!badgeDetails) return null;

  return (
    <Fragment>
      <BottomSheetModal
        footerComponent={({ animatedFooterPosition }) => (
          <CustomFooter
            animatedFooterPosition={animatedFooterPosition}
            isBadgeSelected={!!selectedBadgeDetails}
            onPress={onFooterPress}
          />
        )}
        backdropComponent={renderBackdrop}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: '#D8D8D8' }}
        ref={bottomSheetRef}>
        <CustomTextBold style={styles.title}>Badges</CustomTextBold>
        <BottomSheetFlatList
          numColumns={3}
          data={badgeDetails}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.modalBadgeButtonWrapper}
                onPress={() => {
                  onBadgeSelect(item);
                }}>
                <View style={styles.modalBadgeWrapper}>
                  <Image source={{ uri: item.icon }} style={styles.modalBadgeImage} />
                  <View style={styles.badgePointWrapper}>
                    <CustomTextBold style={styles.badgePoint}>
                      {item?.point}
                      {'pt'}
                    </CustomTextBold>
                  </View>
                </View>
                <CustomText style={styles.modalBadgeTitle}>{item?.title}</CustomText>
              </TouchableOpacity>
            );
          }}
        />
        {!!selectedBadgeDetails && <BadgeInfo badgeDetails={selectedBadgeDetails} />}
      </BottomSheetModal>

      <View style={styles.container}>
        <View style={styles.header}>
          <CustomTextBold style={styles.title}>Badges</CustomTextBold>
          <TouchableOpacity onPress={() => bottomSheetRef.current?.present()}>
            <CustomText style={styles.seeAll}>See all {'>'} </CustomText>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ paddingTop: 5 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {badgeDetails?.map((badge, index) => (
            <View
              key={index}
              style={{
                marginLeft: index !== 0 ? RFValue(3) : 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={{ uri: badge.icon }} style={styles.badgeWrapper} />
            </View>
          ))}
        </ScrollView>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: RFValue(10),
    height: RFValue(75),
    marginTop: RFValue(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    textAlign: 'center',
    fontSize: RFValue(13),
  },
  seeAll: {
    fontSize: RFValue(13),
    color: '#808080',
  },
  badgeWrapper: {
    width: RFValue(55),
    height: RFValue(55),
    resizeMode: 'contain',
  },
  badgePointWrapper: {
    position: 'absolute',
    bottom: RFValue(0),
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: RFValue(5),
    padding: RFValue(2),
    paddingHorizontal: RFValue(5),
    shadowColor: '#00000029',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
  },
  badgePoint: {
    fontSize: RFValue(9),
  },
  modalBadgeButtonWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: RFValue(15),
    marginHorizontal: RFValue(10),
    flex:1,
  },
  modalBadgeWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalBadgeTitle: {
    fontSize: RFValue(12),
    color: '#808080',
    paddingTop: RFValue(5),
  },
  modalBadgeImage: {
    width: RFValue(65),
    height: RFValue(65),
    resizeMode: 'contain',
  },

});
export default Badges;
