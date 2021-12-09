import React, {useRef, useState} from "react";
import {View, ScrollView, TouchableOpacity, Platform, StatusBar, ToastAndroid} from "react-native";
import SwipeLine from "../../assets/svg/illustrations/SwipeLine";
import {CustomText} from "../../highordercomponents";
import Info from "../../assets/svg/illustrations/Info";
import Popover from "react-native-popover-view";
import {fetchHandler} from "../../helper/helper";
import {marketplaceStyles} from "../../styles/marketplaceStyles";
import {ListItem} from "./index";


const List = ({navigation}) => {

  const touchable = useRef();
  const [showPopover, setShowPopover] = useState(false);
  const [projects, setProjects] = useState([]);

  fetchHandler({
    url: `${process.env.API_URL}/api/get-marketplaces`,
    method: "POST",
  }).then((res) => {
    setProjects(res.data)
  }).catch((err) => {
    ToastAndroid.show(err.response.data.message, ToastAndroid.SHORT);
  });

  return (
    <View style={marketplaceStyles.container}>
      <View style={marketplaceStyles.panelHeader}>
        <SwipeLine/>
      </View>
      <View style={marketplaceStyles.listHeader}>
        <CustomText style={marketplaceStyles.title}>
          Join a project now.
        </CustomText>
        <View>
          <TouchableOpacity ref={touchable} onPress={() => setShowPopover(true)}>
            <Info/>
          </TouchableOpacity>
          <Popover
            placement={"bottom"}
            from={touchable}
            isVisible={showPopover}
            onRequestClose={() => setShowPopover(false)}
            verticalOffset={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
          >
            <CustomText style={marketplaceStyles.popoverText}>
              Find or offer help on image collection and data verification projects to create fresh map data in locations where it’s needed.
            </CustomText>
          </Popover>
        </View>
      </View>
      <ScrollView>
        {projects.map((value, index) => {
          return (
            <View key={index}>
              <ListItem data={value} navigation={navigation} />
            </View>
          )
        })}
      </ScrollView>
    </View>
  );
};

export default List;