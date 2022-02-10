import React from "react";
import { View, TouchableOpacity } from "react-native";
import { CustomText } from "../../highordercomponents";
import { marketplaceItemStyles } from "../../styles/marketplaceStyles";
import { Routes } from "../../navigator/Routes";
import { useSelector } from "react-redux";

const ListItem = ({ data, navigation }) => {
  const { auth } = useSelector((state) => state.getTokenReducer);

  const loginRouteHandler = () => {
    if (auth) {
      navigation.navigate(Routes.marketplaceDetail, { data: data });
    } else {
      navigation.navigate(Routes.login);
    }
  };

  return (
    <TouchableOpacity
      style={marketplaceItemStyles.container}
      onPress={loginRouteHandler}
    >
      <View style={marketplaceItemStyles.topContainer}>
        <CustomText style={marketplaceItemStyles.owner}>
          {data.owner}
        </CustomText>
        <CustomText style={marketplaceItemStyles.job}>
          Imagery Capture
        </CustomText>
      </View>
      <CustomText style={marketplaceItemStyles.title}>
        {data.marketplace_name}
      </CustomText>
      <CustomText style={marketplaceItemStyles.description} lineCount={2}>
        {data.marketplace_description}
      </CustomText>
      <CustomText style={marketplaceItemStyles.equipment}>
        CAPTURE EQUIPMENT: {data.project_camera_type}
      </CustomText>
    </TouchableOpacity>
  );
};

export default ListItem;
