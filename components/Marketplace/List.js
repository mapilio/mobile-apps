import React, {useRef, useState} from "react";
import {Platform, ScrollView, StatusBar, TouchableOpacity, View} from "react-native";
import SwipeLine from "../../assets/svg/illustrations/SwipeLine";
import {CustomText} from "../../highordercomponents";
import Info from "../../assets/svg/illustrations/Info";
import Popover, {PopoverPlacement} from "react-native-popover-view";
import {marketplaceStyles} from "../../styles/marketplaceStyles";
import ListItem from "./ListItem";
import {RFValue} from "react-native-responsive-fontsize";
import {useSelector} from "react-redux";
import {CloseIcon, Marketplace} from "../../assets/svg/illustrations";

const List = ({setOnScroll, slidePanel, setToggleSlidePanel }) => {
  const {marketplaceData} = useSelector((status) => status.marketplaceReducer);
  const [showPopover, setShowPopover] = useState(false);
  const touchable = useRef();

  return (
    <View style={marketplaceStyles.container}>
      <TouchableOpacity style={marketplaceStyles.closeIcon} onPress={() => setToggleSlidePanel(prev => !prev)}>
        <CloseIcon/>
      </TouchableOpacity>
      <View style={marketplaceStyles.panelHeader} onTouchStart={() => setOnScroll(false)}>
        <SwipeLine/>
      </View>
      <View style={marketplaceStyles.listHeader} onTouchStart={() => setOnScroll(false)}>
        <Marketplace width={RFValue(25)} height={RFValue(25)} color={'#3F8BE9'} style={{marginRight: 10}}/>
        <CustomText style={marketplaceStyles.title}>
          Marketplace
        </CustomText>
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
      </View>
      <ScrollView
        onScrollBeginDrag={() => setOnScroll(true)}
        onScrollEndDrag={() => setOnScroll(false)}
        onTouchStart={() => setOnScroll(true)}
        style={{marginBottom: RFValue(190)}}
      >
        {!!Object.keys(marketplaceData).length > 0 &&
          marketplaceData.features.map((value, index) => {
            return (
              <ListItem key={index} data={value.properties} coordinates={value} slidePanel={slidePanel}/>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default List;
