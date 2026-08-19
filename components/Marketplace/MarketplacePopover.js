import { Platform, StatusBar, TouchableOpacity, View } from 'react-native';
import Info from '../../assets/svg/illustrations/Info';
import { RFValue } from 'react-native-responsive-fontsize';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { CustomText } from '../../highordercomponents';
import { marketplaceStyles } from '../../styles/marketplaceStyles';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MarketplacePopover = () => {
  const [showPopover, setShowPopover] = useState(false);
  const { t } = useTranslation('marketplace');
  const touchable = useRef();

  return (
    <View>
      <TouchableOpacity
        ref={touchable}
        onPressIn={() => setShowPopover(true)}
        onPress={() => setShowPopover(true)}
        accessibilityRole="button"
        accessibilityLabel="Marketplace information">
        <Info width={RFValue(16)} height={RFValue(16)} color={'#D8D8D8'} />
      </TouchableOpacity>
      <Popover
        placement={PopoverPlacement.BOTTOM}
        from={touchable}
        isVisible={showPopover}
        onRequestClose={() => setShowPopover(false)}
        verticalOffset={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}>
        <CustomText style={marketplaceStyles.popoverText}>{t('tooltip')}</CustomText>
      </Popover>
    </View>
  );
};

export default MarketplacePopover;
