import React from "react";
import {View, Image, ScrollView} from "react-native";
import {CustomText, CustomTextBold, CustomTextMedium} from "../highordercomponents";
import {RFValue} from "react-native-responsive-fontsize";
import {globalStyles} from "../styles/globalStyles";
import {marketplaceDetailStyles} from "../styles/marketplaceStyles";
import {fetchHandler, toastGenerator} from "../helper/helper";
import {Routes} from "../navigator/Routes";
import Moment from 'moment';
import {errorAlertStyles} from "../styles/alertStyles";
import {SERVICE_URL} from '@env'

const MarketplaceDetail = ({navigation, route}) => {

  const applyProject = () => {
    fetchHandler({
      url: `${SERVICE_URL}/api/function/projects/job/createJob`,
      method: "POST",
      data: {
        id: route.params.data.id,
      },
    }).then(() => {
      navigation.navigate(Routes.marketplaceReceived);
    }).catch((err) => {
      toastGenerator(
        `${err.response.data.message}`,
        require("../assets/images/Warning.png"),
        errorAlertStyles.alertContainer,
        errorAlertStyles.alertTitle,
        errorAlertStyles.alertImage,
        3000
      );
    });
  }

  return (
    <View style={marketplaceDetailStyles.container}>
      <ScrollView>
        <View style={globalStyles.container}>
          <View style={{flexDirection: "row"}}>
            <CustomText style={marketplaceDetailStyles.secondaryTextColor}>Employer </CustomText>
            <CustomText style={marketplaceDetailStyles.blueTextColor}>{route.params.data.owner}</CustomText>
          </View>
          <CustomTextBold style={marketplaceDetailStyles.title}>{route.params.data.marketplace_name}</CustomTextBold>
          <CustomText style={{...marketplaceDetailStyles.secondaryTextColor, ...marketplaceDetailStyles.smallText}}>
            {Moment(route.params.data.created_at).format('d MMM. H:M')}
          </CustomText>
          <View style={marketplaceDetailStyles.imageArea}>
            <Image
              source={require("../assets/images/capture_zone.png")}
              resizeMode={"contain"}
              style={marketplaceDetailStyles.image}
            />
            <Image
              source={require("../assets/images/gopro.png")}
              resizeMode={"contain"}
              style={marketplaceDetailStyles.image}
            />
          </View>
          <CustomTextMedium
            style={{...marketplaceDetailStyles.primaryText, ...marketplaceDetailStyles.captureZoneText}}>
            This is the capture zone. You need to hit the road with {route.params.data.project_camera_type}
          </CustomTextMedium>
          <CustomText style={{...marketplaceDetailStyles.primaryText, fontSize: RFValue(14)}}>
            {route.params.data.marketplace_description}
          </CustomText>
        </View>
      </ScrollView>
      <View style={marketplaceDetailStyles.bottomSection}>
        <CustomText style={marketplaceDetailStyles.button} onPress={applyProject}>
          Apply to this project
        </CustomText>
      </View>
    </View>
  );
};

export default MarketplaceDetail;
