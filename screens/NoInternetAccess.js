import React, { useEffect } from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import { NoInternetAccessIcon } from "../assets/svg/illustrations";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import { Routes } from "../navigator/Routes";
import {useTranslation} from "react-i18next";

const NoInternetAccess = ({navigation}) => {
  const {connection} = useSelector((state) => state.generalReducer);
  const {auth} = useSelector((state) => state.getTokenReducer);
  const {t} = useTranslation("no_internet");

  useEffect(() => {
    if (!connection.connectionStatus) return;

    navigation.navigate('MapTab', {screen: Routes.map});
  }, [connection, auth, navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#130C47",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <NoInternetAccessIcon />
      <View
        style={{
          paddingHorizontal: RFValue(25),
          marginTop: RFValue(45),
          alignItems: "center",
        }}
      >
        <CustomTextMedium
          style={{
            fontSize: RFValue(14),
            color: "#FFFFFF",
            marginBottom: RFValue(8),
            textAlign: "center",
          }}
        >
          {t("title")}
        </CustomTextMedium>
        <CustomText
          lineCount={10}
          style={{
            textAlign: "center",
            fontSize: RFValue(12),
            color: "#FFFFFF",
          }}
        >
          {t("description")}
        </CustomText>
      </View>
    </View>
  );
};

export default NoInternetAccess;
