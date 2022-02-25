import React from "react";
import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "../../assets/svg/illustrations";
import { CustomText } from "../../highordercomponents";
import { sequenceLeft } from "../../styles/navigatorBarStyles";
import { useRoute } from "@react-navigation/native";
import { Routes } from "../Routes";
import { useDispatch, useSelector } from "react-redux";

const SequenceNavigatorLeft = (props) => {
  const route = useRoute();
  const { userInformation } = useSelector((state) => state.getTokenReducer);

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.7}
      style={sequenceLeft.container}
      onPress={() => {
        if (!route?.params?.base) {
          props.navigation.navigate(props.backRoute);
        } else {
          props.navigation.navigate(Routes.profileSequence, {
            id: route.params.points[0].sequence_uuid,
            user_id: userInformation.user_id,
          });
        }
      }}
    >
      <ArrowLeft />
      <CustomText style={sequenceLeft.backTitle}>Back</CustomText>
    </TouchableOpacity>
  );
};

export default SequenceNavigatorLeft;
