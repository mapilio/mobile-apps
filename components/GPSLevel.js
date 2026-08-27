import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSelector } from 'react-redux';
import { CustomTextMedium } from '../highordercomponents';
import { CheckIcon, WarningIcon } from '../assets/svg/illustrations';

const GPSLevel = () => {
  const { GPSAccuracy } = useSelector((state) => state.cameraReducer);

  return (
    <View style={styles.gpsInfo}>
      <View
        style={{
          position: 'absolute',
          transform: [
            {
              translateX: RFValue(-5),
            },
          ],
        }}>
        {GPSAccuracy ? (
          <CheckIcon width={RFValue(24)} height={RFValue(24)} />
        ) : (
          <WarningIcon width={RFValue(24)} height={RFValue(24)} />
        )}
      </View>
      <CustomTextMedium style={styles.statusText}>
        {GPSAccuracy ? 'Good GPS' : 'Bad GPS'}
      </CustomTextMedium>
    </View>
  );
};

const styles = StyleSheet.create({
  gpsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: RFValue(10),
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: RFValue(14),
    marginLeft: RFValue(30),
  },
});

export default GPSLevel;
