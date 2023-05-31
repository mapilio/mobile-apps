import React from "react";
import { View, Image } from "react-native";
import { CustomText, CustomTextMedium } from "../../highordercomponents";
import { marketplaceReceivedStyles } from "../../styles/marketplaceStyles";
import { Routes } from "../../navigator/Routes";
import { RFValue } from "react-native-responsive-fontsize";
import { UPDATE_SELECTED_PROJECT } from "../../store/actionsName";
import { useDispatch } from "react-redux";
import {Trans, useTranslation} from "react-i18next";

const MarketplaceReady = ({ navigation, route }) => {
  const {t} = useTranslation("marketplace")
  const dispatch = useDispatch();

  const goToMarketPlace = () => (
    <CustomText style={marketplaceReceivedStyles.link} onPress={() => navigation.navigate(Routes.marketplace)}/>
  )

  return (
    <View style={marketplaceReceivedStyles.container}>
      <Image
        source={require("../../assets/images/ready.png")}
        resizeMode={"contain"}
        style={marketplaceReceivedStyles.image}
      />
      <CustomTextMedium style={marketplaceReceivedStyles.title}>
        {t("mission_ready")}
      </CustomTextMedium>
      <CustomText style={marketplaceReceivedStyles.description}>
        {t("mission_detail")}
      </CustomText>
      <CustomText
        style={marketplaceReceivedStyles.button}
        onPress={() => {
          dispatch({
            type: UPDATE_SELECTED_PROJECT,
            payload: {
              type: "project",
              projectName: route.params.data.marketplace_name,
              projectKey: route.params.data.project_key,
              organizationKey: route.params.data.organization_key,
              id: route.params.data.id,
            },
          });
          navigation.navigate(Routes.cameraTab);
        }}
      >
        {t("start_capture")}
      </CustomText>
      <CustomText style={marketplaceReceivedStyles.or}>
        {t("or")}
      </CustomText>
      <CustomText style={{marginBottom: RFValue(30)}}>
        <Trans t={t} i18nKey={"back_to_the"} components={[goToMarketPlace()]}/>
      </CustomText>
    </View>
  );
};

export default MarketplaceReady;
