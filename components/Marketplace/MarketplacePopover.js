import {Platform, StatusBar, TouchableOpacity, View} from "react-native";
import Info from "../../assets/svg/illustrations/Info";
import {RFValue} from "react-native-responsive-fontsize";
import Popover, {PopoverPlacement} from "react-native-popover-view";
import {CustomText} from "../../highordercomponents";
import {marketplaceStyles} from "../../styles/marketplaceStyles";
import React, {useRef, useState} from "react";

const MarketplacePopover = () => {
  const [showPopover, setShowPopover] = useState(false);
  const touchable = useRef();

  return (
    <View>
      <TouchableOpacity ref={touchable} onPressIn={() => setShowPopover(true)}>
        <Info width={RFValue(16)} height={RFValue(16)} color={"#D8D8D8"}/>
      </TouchableOpacity>
      <Popover
        placement={PopoverPlacement.BOTTOM}
        from={touchable}
        isVisible={showPopover}
        onRequestClose={() => setShowPopover(false)}
        verticalOffset={Platform.OS === "android" ? -StatusBar.currentHeight : 0}
      >
        <CustomText style={marketplaceStyles.popoverText}>
          Find or offer help on image collection and data verification
          projects to create fresh map data in locations where it’s needed.
        </CustomText>
      </Popover>
    </View>
  )
}

export default MarketplacePopover;
