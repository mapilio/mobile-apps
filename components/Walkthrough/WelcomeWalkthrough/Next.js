import React from "react";
import {TouchableOpacity} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {CustomText} from "../../../highordercomponents";
import {Routes} from "../../../navigator/Routes";
import {useNavigation} from "@react-navigation/native";
import {UPDATE_WELCOME_WALKTHROUGH_STATUS} from "../../../store/actionsName";
import {useDispatch} from "react-redux";

const Buttons = ({ active, dataLength = 0 }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const pressHandle = () => {
    if (active === dataLength - 1) {
      dispatch({ type: UPDATE_WELCOME_WALKTHROUGH_STATUS, payload: true });
      navigation.navigate(Routes.tabNavigator, {screen: Routes.map})
    } else {
      _carousel.snapToNext()
    }
  }

  return (
    <TouchableOpacity onPress={pressHandle}>
      <CustomText style={{ fontSize: RFValue(17), color: "#4A4A4A" }}>
        {active === dataLength - 1 ? "      Start" : "Next"}
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;
