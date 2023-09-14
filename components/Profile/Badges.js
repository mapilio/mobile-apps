import { View, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { CustomTextBold, CustomText } from '../../highordercomponents';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Traveller } from '../../assets/svg/illustrations/BadgesIcons';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Fragment, useRef, useMemo, useCallback } from 'react';

const Badges = () => {
  const bottomSheetRef = useRef(null);

  const badgesJson = Array.from({ length: 10 }, () => ({
    name: 'badge',
    description: 'badge description',
  }));

  const snapPoints = useMemo(() => ['50%'], []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop {...props} opacity={0.4} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    []
  );

  return (
    <Fragment>
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        snapPoints={snapPoints}
        ref={bottomSheetRef}>
        <CustomTextBold style={styles.title}>Badges</CustomTextBold>
        <BottomSheetScrollView
          contentContainerStyle={styles.modalContainer}>
          {badgesJson.map((_, index) => (
            <View
              key={index}
              style={{paddingHorizontal:RFValue(3)}}
              >
              <Traveller width={RFValue(70)} height={RFValue(70)} />
            </View>
          ))}
        </BottomSheetScrollView>
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
          {badgesJson.map((badge, index) => (
            <View
              key={index}
              style={{
                marginLeft: index !== 0 ? RFValue(3) : 0,
                justifyContent: 'center',
              }}>
              <Traveller width={RFValue(60)} height={RFValue(60)} />
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
    height: RFValue(90),
    marginVertical: RFValue(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    textAlign: 'center',
    fontSize: RFValue(13),
    padding: RFValue(5),
  },
  seeAll: {
    fontSize: RFValue(13),
    color: '#808080',
  },
  modalContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "center",
  }
});
export default Badges;
