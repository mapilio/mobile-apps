import React, { useEffect, useState, Fragment } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import SwipeLine from "../../assets/svg/illustrations/SwipeLine";
import { CustomText, CustomTextBold } from "../../highordercomponents";
import {
  marketplaceDetailStyles,
  marketplaceStyles,
} from "../../styles/marketplaceStyles";
import ListItem from "./ListItem";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import { CloseIcon, Marketplace } from "../../assets/svg/illustrations";
import MarketplacePopover from "./MarketplacePopover";
import { centerOfMass, centroid, polygon } from "@turf/turf";
import { MARKETPLACE_CENTER, ZOOM_LEVEL } from "../../store/actionsName";
import { getEquipment, isNear } from "../../helper/marketplace";
import { Routes } from "../../navigator/Routes";
import { setGeoJson } from "../../helper/geojson";
import { useTranslation } from "react-i18next";
import { TooltipWrapper } from "../../components/Tooltip";
import { tooltipContents } from "../../util/consts/tooltip";
import SkeletonPlaceholder from "../Skeleton";
import { useIsFocused } from "@react-navigation/native";
import {api} from "../../util/helpers/api";

const PlaceHolder = () => {
  return (
    <SkeletonPlaceholder  >
      <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginVertical={20}>
        <SkeletonPlaceholder.Item >
          <SkeletonPlaceholder.Item
            width={Dimensions.get("window").width - 20}
            height={RFValue(20)}
            borderRadius={RFValue(4)}
          />
          <SkeletonPlaceholder.Item
            marginTop={RFValue(6)}
            width={Dimensions.get("window").width - 150}
            height={RFValue(20)}
            borderRadius={RFValue(4)}
          />
          <SkeletonPlaceholder.Item
            marginTop={RFValue(10)}
            width={Dimensions.get("window").width/4}
            height={RFValue(20)}
            borderRadius={RFValue(4)}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

const Detail = ({ project, onClose, setOnScroll, navigation }) => {
  const { t } = useTranslation("marketplace");
  useEffect(() => setOnScroll(false), []);
  const isFocused = useIsFocused();

  const {
    properties: {
      id,
      owner,
      marketplace_name,
      marketplace_description,
      project_camera_type,
    },
    geometry,
  } = project;
  const { auth } = useSelector((status) => status.getTokenReducer);

  const acceptProject = () => {
    if (!auth) {
      return navigation.navigate(Routes.stackNavigator, {
        screen: Routes.login,
      });
    } else {
      const polygon = setGeoJson(geometry.coordinates, "polygon");
      const targetPoint = centroid(polygon);

      isNear(targetPoint)
        .then((distance) => {
          if (distance > 5) {
            toast.show(`${t("far_location")}.`, { type: "error" });
          } else {
            api.post(`/api/function/projects/job/createJob`, {options: {parameters: {id: id}}}).then(() => {
              navigation.navigate(Routes.marketplaceReady, {
                data: project.properties,
              });
            }).catch((err) => toast.show(`${err}`, {type: "error"})
            );
          }
        })
        .catch((err) => toast.show(`${err.message || err}`, { type: "error" }));
    }
  };

  return (
    <View style={marketplaceStyles.container}>
      <TouchableOpacity style={marketplaceStyles.closeIcon} onPress={onClose}>
        <CloseIcon />
      </TouchableOpacity>

      <View style={marketplaceStyles.panelHeader}>
        <SwipeLine />
      </View>
      {isFocused && (
        <TooltipWrapper
          name={"apply"}
          content={tooltipContents.marketplace.apply}
          placement={"top"}
        >
        <View style={{width:"100%"}}>
            <CustomText style={marketplaceDetailStyles.marketplace_name}>
              {marketplace_name}
            </CustomText>
            <CustomTextBold style={marketplaceDetailStyles.owner}>
              {owner}
            </CustomTextBold>
            <CustomText style={marketplaceDetailStyles.description}>
              {marketplace_description}
            </CustomText>

            <CustomText style={marketplaceDetailStyles.equipmentInfo}>
              {t("equipment")} :{"\u00A0"}
              {getEquipment(project_camera_type).icon}
              {"\u00A0"}
              <CustomTextBold style={marketplaceDetailStyles.equipment}>
                {getEquipment(project_camera_type).name}
              </CustomTextBold>
            </CustomText>

            <TouchableOpacity
              style={marketplaceDetailStyles.button}
              onPress={acceptProject}
            >
              <CustomText style={marketplaceDetailStyles.buttonText}>
                {t("apply_project")}
              </CustomText>
            </TouchableOpacity>
          </View>
        </TooltipWrapper>
      )}
    </View>
  );
};

const Projects = ({ slidePanel, setOnScroll, onSelectedItem, navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("marketplace");
  const { marketplaceData } = useSelector(
    (status) => status.marketplaceReducer
  );
  const isFocused = useIsFocused();

  const handleItemClick = (clickedItem) => {
    const center = centerOfMass(polygon(clickedItem.geometry.coordinates));
    dispatch({
      type: MARKETPLACE_CENTER,
      payload: center.geometry.coordinates,
    });
    dispatch({ type: ZOOM_LEVEL, payload: 8 });
    onSelectedItem(clickedItem);
    slidePanel.current?.snapToIndex(0);
  };

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
        <Marketplace
          width={RFValue(23)}
          height={RFValue(23)}
          color={"#0056F1"}
          style={{ marginRight: 10 }}
        />
        <CustomText style={marketplaceStyles.title}>
          {t("marketplace")}
        </CustomText>
        <MarketplacePopover />
      </View>
      <ScrollView
        onScrollBeginDrag={() => setOnScroll(true)}
        onScrollEndDrag={() => setOnScroll(false)}
        onTouchStart={() => setOnScroll(true)}
        style={{ marginBottom: RFValue(190), flex: 1 }}
      >
        {!!Object.keys(marketplaceData).length > 0 ? (
          marketplaceData.features.map((value, index) => {
            if (index === 1) {
              return isFocused && (
                 <Fragment key={index}>
                   <TooltipWrapper
                     key={index}
                     name="list"
                     content={tooltipContents.marketplace.list}
                     placement="top"
                     handleNext={() => {
                       handleItemClick(value);
                     }}
                   >
                     <ListItem
                       key={index}
                       data={value.properties}
                       onClick={() => handleItemClick(value)}
                     />
                   </TooltipWrapper>
                   <View
                     style={{
                       backgroundColor: "#CBD1D9",
                       width: "100%",
                       height: 1,
                     }}
                   />
                 </Fragment>
               );

            }
            return (
              <Fragment key={index}>
              <ListItem
                key={index}
                data={value.properties}
                onClick={() => handleItemClick(value)}
              />
              <View style={{backgroundColor:"#CBD1D9", width:"100%", height:1}} />
              </Fragment>

            );
          })
        ) : (
          Array(3).fill(0).map((_, index) => (
            <PlaceHolder key={index} />
          ))

        )}
      </ScrollView>
    </View>
  );
};

const List = ({ navigation, setOnScroll, slidePanel }) => {
  const [projectDetail, setProjectDetail] = useState(null);

  const handleSelectedItem = (selectedItem) => {
    setProjectDetail(selectedItem);
  };

  const closeHandle = () => {
    setProjectDetail(null);
    slidePanel.current?.snapToIndex(1);
  };

  if (projectDetail) {
    return (
      <Detail
        navigation={navigation}
        project={projectDetail}
        setOnScroll={setOnScroll}
        onClose={closeHandle}
      />
    );
  } else {
    return (
      <Projects
        navigation={navigation}
        setOnScroll={setOnScroll}
        onSelectedItem={handleSelectedItem}
        slidePanel={slidePanel}
      />
    );
  }
};

export default List;
