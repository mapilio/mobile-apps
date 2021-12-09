import React from "react";
import {View, TouchableOpacity} from "react-native";
import {CustomText} from "../../highordercomponents";
import {marketplaceItemStyles} from "../../styles/marketplaceStyles";
import {Routes} from "../../navigator/Routes";


const ListItem = ({data, navigation}) => {
  return (
    <TouchableOpacity style={marketplaceItemStyles.container} onPress={() => navigation.navigate(Routes.marketplaceDetail, {data: data})}>
      <View style={marketplaceItemStyles.topContainer}>
        <CustomText style={marketplaceItemStyles.owner}>{data.owner}</CustomText>
        <CustomText style={marketplaceItemStyles.job}>Imagery Capture</CustomText>
      </View>
      <CustomText style={marketplaceItemStyles.title}>{data.marketplace_name}</CustomText>
      <CustomText style={marketplaceItemStyles.description} numberOfLines={2}>{data.marketplace_description}</CustomText>
      <CustomText style={marketplaceItemStyles.equipment}>CAPTURE EQUIPMENT: {data.project_camera_type}</CustomText>
    </TouchableOpacity>
  );
};

export default ListItem;