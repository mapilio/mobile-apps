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
  const { activeSequence } = useSelector((state) => state.uploadReducer);
  const { currentFeedSequence } = useSelector((state) => state.generalReducer);

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
            id: currentFeedSequence.sequenceUUID,
            user_id: currentFeedSequence.userID,
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
