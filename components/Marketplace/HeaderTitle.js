import React from 'react';
import { View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { CustomTextMedium } from '../../highordercomponents';
import { Marketplace } from '../../assets/svg/illustrations';

const HeaderTitle = () => {
  return (
    <View
      style={{
        marginBottom: RFValue(-5),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{ marginTop: RFValue(-4), marginRight: RFValue(6) }}>
        <Marketplace />
      </View>
      <CustomTextMedium style={{ color: '#FFFFFF', fontSize: RFValue(16) }}>
        Marketplace
      </CustomTextMedium>
    </View>
  );
};

export default HeaderTitle;
