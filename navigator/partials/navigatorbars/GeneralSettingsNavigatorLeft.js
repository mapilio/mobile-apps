import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from '../../../assets/svg/illustrations';
import { CustomText } from '../../../highordercomponents';
import { generalSettingsLeft } from '../../../styles/navigatorBarStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';

const GeneralSettingsNavigatorLeft = (props) => {
  const { left, right } = useSafeAreaInsets();

  const safeAreaPaddings = {
    paddingLeft: left ? 0 : RFValue(35),
    paddingRight: right ? 0 : RFValue(35),
  };

  return (
    <TouchableOpacity {...props} style={{ ...generalSettingsLeft.container, ...safeAreaPaddings }}>
      <ArrowLeft />
      <CustomText style={generalSettingsLeft.backTitle}>Back</CustomText>
    </TouchableOpacity>
  );
};

export default GeneralSettingsNavigatorLeft;
