import React, {useRef, useState} from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import SwipeLine from "../../assets/svg/illustrations/SwipeLine";
import { CustomText } from "../../highordercomponents";
import Info from "../../assets/svg/illustrations/Info";
import Popover from "react-native-popover-view";
import { marketplaceStyles } from "../../styles/marketplaceStyles";
import ListItem from "./ListItem";
import { RFValue } from "react-native-responsive-fontsize";
import {useSelector} from "react-redux";

const List = ({setOnScroll, slidePanel }) => {
  const {marketplaceData} = useSelector((status) => status.marketplaceReducer);
  const [showPopover, setShowPopover] = useState(false);
  const touchable = useRef();


  return (
    <View style={marketplaceStyles.container}>
      <View
        style={marketplaceStyles.panelHeader}
        onTouchStart={() => setOnScroll(false)}
      >
        <SwipeLine />
      </View>
      <View
        style={marketplaceStyles.listHeader}
        onTouchStart={() => setOnScroll(false)}
      >
        <CustomText style={marketplaceStyles.title}>
          Join a project now.
        </CustomText>
        <View>
          <TouchableOpacity
            style={{ marginRight: RFValue(20), marginBottom: RFValue(8) }}
            ref={touchable}
            onPress={() => setShowPopover(true)}
          >
            <Info />
          </TouchableOpacity>
          <Popover
            placement={"bottom"}
            from={touchable}
            isVisible={showPopover}
            onRequestClose={() => setShowPopover(false)}
            verticalOffset={
              Platform.OS === "android" ? -StatusBar.currentHeight : 0
            }
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
        style={{ marginBottom: RFValue(190) }}
      >
        {!!Object.keys(marketplaceData).length > 0 &&
          marketplaceData.features.map((value, index) => {
            return (
              <View key={index}>
                <ListItem data={value.properties} coordinates={value} slidePanel={slidePanel}/>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default List;
