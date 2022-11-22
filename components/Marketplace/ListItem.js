import React from "react";
import { View, TouchableOpacity } from "react-native";
import {CustomText, CustomTextBold} from "../../highordercomponents";
import { marketplaceItemStyles } from "../../styles/marketplaceStyles";
import {getEquipment} from "../../helper/marketplace";

const ListItem = ({data, onClick}) => {
  const {owner, marketplace_description, project_camera_type} = data
  const {icon, name} = getEquipment(project_camera_type);

  return (
    <TouchableOpacity style={marketplaceItemStyles.container} onPress={onClick}>
      <View style={marketplaceItemStyles.topContainer}>
        <CustomTextBold style={marketplaceItemStyles.owner}>
          {owner}
        </CustomTextBold>
      </View>
      <CustomText style={marketplaceItemStyles.description} lineCount={2}>
        {marketplace_description}
      </CustomText>
      <CustomText style={marketplaceItemStyles.equipmentInfo}>
        EQUIPMENT:
        {'\u00A0'}{icon}{'\u00A0'}
        <CustomText style={marketplaceItemStyles.equipment}>{name}</CustomText>
      </CustomText>
    </TouchableOpacity>
  );
};

export default ListItem;
