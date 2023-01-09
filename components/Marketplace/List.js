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
import {centerOfMass, centroid, polygon} from "@turf/turf";
import {MARKETPLACE_CENTER, ZOOM_LEVEL} from "../../store/actionsName";
import {getEquipment, isNear} from "../../helper/marketplace";
import {Routes} from "../../navigator/Routes";
import {setGeoJson} from "../../helper/geojson";
import {fetchHandler} from "../../helper/helper";
import {useTranslation} from "react-i18next";
import Config from "react-native-config";

const Detail = ({project, onClose, setOnScroll, navigation}) => {
  const {t} = useTranslation("marketplace");
  useEffect(() => setOnScroll(false), []);

  const {properties: {id, owner, marketplace_name, marketplace_description, project_camera_type}, geometry} = project
  const {auth} = useSelector((status) => status.getTokenReducer)

  const acceptProject = () => {
    if(!auth){
      return navigation.navigate(Routes.stackNavigator, {screen:Routes.login})
    }else{
      const polygon = setGeoJson(geometry.coordinates, "polygon")
      const targetPoint = centroid(polygon);

      isNear(targetPoint).then((distance) => {
        if (distance > 5) {
          toast.show(`${t("far_location")}.`, {type: 'error'})
        } else {
          fetchHandler({
            url: `${Config.SERVICE_URL}/api/function/projects/job/createJob`,
            method: "POST",
            data: {options: {parameters: {id: id}}},
          }).then(() => {
            navigation.navigate(Routes.marketplaceReady, {data: project.properties,});
          }).catch(err => toast.show(`${err.response.data.message}`, {type: 'error'}))
        }
      }).catch((err) => toast.show(`${err.message || err}`, {type: 'error'}))
    }
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

      <CustomText style={marketplaceDetailStyles.equipmentInfo}>{t("equipment")} :
        {'\u00A0'}{getEquipment(project_camera_type).icon}{'\u00A0'}
        <CustomTextBold style={marketplaceDetailStyles.equipment}>{getEquipment(project_camera_type).name}</CustomTextBold>
      </CustomText>

      <TouchableOpacity style={marketplaceDetailStyles.button} onPress={acceptProject}>
        <CustomText style={marketplaceDetailStyles.buttonText}>
          {t("apply_project")}
        </CustomText>
      </TouchableOpacity>
    </View>
  )
}

const Projects = ({slidePanel, setOnScroll, onSelectedItem, navigation}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation("marketplace");
  const {marketplaceData} = useSelector((status) => status.marketplaceReducer);

  const handleItemClick = (clickedItem) => {
    const center = centerOfMass(polygon(clickedItem.geometry.coordinates))
    dispatch({type: MARKETPLACE_CENTER, payload: center.geometry.coordinates})
    dispatch({type: ZOOM_LEVEL, payload: 8})
    onSelectedItem(clickedItem)
    slidePanel.show(RFValue(250))
  }

  return (
    <View style={marketplaceStyles.container}>
      <TouchableOpacity style={marketplaceStyles.closeIcon} onPress={() => slidePanel.hide()}>
        <CloseIcon/>
      </TouchableOpacity>
      <View style={marketplaceStyles.panelHeader} onTouchStart={() => setOnScroll(false)}>
        <SwipeLine/>
      </View>
      <View style={marketplaceStyles.listHeader} onTouchStart={() => setOnScroll(false)}>
        <Marketplace width={RFValue(25)} height={RFValue(25)} color={'#3F8BE9'} style={{marginRight: 10}}/>
        <CustomText style={marketplaceStyles.title}>
          {t("marketplace")}
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

const List = ({navigation, setOnScroll, slidePanel}) => {
  const [projectDetail, setProjectDetail] = useState(null);

  const handleSelectedItem = (selectedItem) => {
    setProjectDetail(selectedItem)
  }

  const closeHandle = () => {
    setProjectDetail(null)
    slidePanel.show(RFValue(400))
  }

  if (projectDetail) {
    return (
      <Detail
        navigation={navigation}
        project={projectDetail}
        setOnScroll={setOnScroll}
        onClose={closeHandle}
      />
    )
  } else {
    return (
      <Projects
        navigation={navigation}
        setOnScroll={setOnScroll}
        onSelectedItem={handleSelectedItem}
        slidePanel={slidePanel}
      />
    )
  }
};

export default List;
