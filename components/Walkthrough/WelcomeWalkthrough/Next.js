import React from "react";
import {TouchableOpacity} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {CustomText} from "../../../highordercomponents";
import {Routes} from "../../../navigator/Routes";
import {useNavigation} from "@react-navigation/native";
import {UPDATE_WELCOME_WALKTHROUGH_STATUS} from "../../../store/actionsName";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";

const Next = ({ activeStep, dataLength = 0 }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation("welcome_walkthrough");

  const pressHandle = () => {
    if (activeStep === dataLength - 1) {
      dispatch({ type: UPDATE_WELCOME_WALKTHROUGH_STATUS, payload: true });
      navigation.navigate(Routes.tabNavigator, {screen: Routes.map})
    } else {
      _carousel.snapToNext()
    }
  }


  return (
    <TouchableOpacity onPress={pressHandle}>
      <CustomText style={{ fontSize: RFValue(17), color: "#4A4A4A", paddingRight:RFValue(35) }}>
        {activeStep === dataLength - 1 ? t("start") : t("next")}
      </CustomText>
    </TouchableOpacity>
  );
};

export default Next;
