import React from "react";
import { View, TouchableOpacity } from "react-native";
import {CustomText, CustomTextBold} from "../../highordercomponents";
import { marketplaceItemStyles } from "../../styles/marketplaceStyles";
import {useDispatch} from "react-redux";
import {centerOfMass, polygon} from "@turf/turf"
import {MARKETPLACE_CENTER, ZOOM_LEVEL} from "../../store/actionsName";

const ListItem = ({data, coordinates, slidePanel}) => {
  const dispatch = useDispatch();

  const _showOnMap = () => {
    const center = centerOfMass(polygon(coordinates.geometry.coordinates))
    dispatch({ type: MARKETPLACE_CENTER, payload: center.geometry.coordinates})
    dispatch({type: ZOOM_LEVEL, payload: 8})
    slidePanel.hide()
  };

  const {owner, marketplace_description, project_camera_type} = data

  return (
    <TouchableOpacity style={marketplaceItemStyles.container} onPress={_showOnMap}>
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
        <CustomText style={marketplaceItemStyles.equipment}>{project_camera_type}</CustomText>
      </CustomText>
    </TouchableOpacity>
  );
};

export default ListItem;
