import React, {useEffect, useState} from "react";
import {ScrollView, TouchableOpacity, View} from "react-native";
import SwipeLine from "../../assets/svg/illustrations/SwipeLine";
import {CustomText, CustomTextBold} from "../../highordercomponents";
import {marketplaceDetailStyles, marketplaceStyles} from "../../styles/marketplaceStyles";
import ListItem from "./ListItem";
import {RFValue} from "react-native-responsive-fontsize";
import {useDispatch, useSelector} from "react-redux";
import {CloseIcon, Marketplace} from "../../assets/svg/illustrations";
import MarketplacePopover from "./MarketplacePopover";
import {centerOfMass, polygon} from "@turf/turf";
import {MARKETPLACE_CENTER, ZOOM_LEVEL} from "../../store/actionsName";
import {getEquipment} from "../../helper/marketplace";
import {fetchHandler} from "../../helper/helper";
import Config from "react-native-config";
import {Routes} from "../../navigator/Routes";
import {toastMessage} from "../../helper/alerts";

const Detail = ({project, onClose, setOnScroll, navigation}) => {
  useEffect(() => setOnScroll(false), []);

  const {properties: {id, owner, marketplace_name, marketplace_description, project_camera_type}} = project

  const acceptProject = () => {
    fetchHandler({
      url: `${Config.SERVICE_URL}/api/function/projects/job/createJob`,
      method: "POST",
      data: {options: {parameters: {id: id}}},
    }).then(() => {
      navigation.navigate(Routes.MarketplaceReady, {data: project.properties,});
    }).catch(err => toastMessage.error(`${err.response.data.message}`))
  }

  return (
    <View style={marketplaceStyles.container}>
      <TouchableOpacity style={marketplaceStyles.closeIcon} onPress={onClose}>
        <CloseIcon/>
      </TouchableOpacity>
      <View style={marketplaceStyles.panelHeader}>
        <SwipeLine/>
      </View>

      <CustomText style={marketplaceDetailStyles.marketplace_name}>{marketplace_name}</CustomText>
      <CustomTextBold style={marketplaceDetailStyles.owner}>{owner}</CustomTextBold>
      <CustomText style={marketplaceDetailStyles.description}>{marketplace_description}</CustomText>

      <CustomText style={marketplaceDetailStyles.equipmentInfo}>EQUIPMENT :
        {'\u00A0'}{getEquipment(project_camera_type).icon}{'\u00A0'}
        <CustomTextBold style={marketplaceDetailStyles.equipment}>{getEquipment(project_camera_type).name}</CustomTextBold>
      </CustomText>

      <TouchableOpacity style={marketplaceDetailStyles.button} onPress={acceptProject}>
        <CustomText style={marketplaceDetailStyles.buttonText}>
          Apply to this project
        </CustomText>
      </TouchableOpacity>
    </View>
  )
}

const Projects = ({setToggleSlidePanel, setOnScroll, onSelectedItem, navigation}) => {
  const dispatch = useDispatch();
  const {auth} = useSelector((status) => status.getTokenReducer)
  const {marketplaceData} = useSelector((status) => status.marketplaceReducer);

  const handleItemClick = (clickedItem) => {
    const center = centerOfMass(polygon(clickedItem.geometry.coordinates))
    dispatch({type: MARKETPLACE_CENTER, payload: center.geometry.coordinates})
    dispatch({type: ZOOM_LEVEL, payload: 8})

    if (auth) {
      onSelectedItem(clickedItem)
    } else {
      navigation.reset({index: 0, routes: [{name: Routes.login}]})
    }
  }

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
        <MarketplacePopover/>
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
              <ListItem
                key={index}
                data={value.properties}
                onClick={() => handleItemClick(value)}
              />
            );
          })}
      </ScrollView>
    </View>
  )
}

const List = ({navigation, setOnScroll, setToggleSlidePanel}) => {
  const [projectDetail, setProjectDetail] = useState(null);

  const handleSelectedItem = (selectedItem) => {
    setProjectDetail(selectedItem)
  }

  if (projectDetail) {
    return (
      <Detail
        navigation={navigation}
        project={projectDetail}
        setOnScroll={setOnScroll}
        onClose={() => setProjectDetail(null)}
      />
    )
  } else {
    return (
      <Projects
        navigation={navigation}
        setOnScroll={setOnScroll}
        onSelectedItem={handleSelectedItem}
        setToggleSlidePanel={setToggleSlidePanel}
      />
    )
  }
};

export default List;
