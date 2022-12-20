import React from "react";
import {TouchableOpacity} from "react-native";
import {useRoute} from "@react-navigation/native";
import {useSelector} from "react-redux";
import {sequenceLeft} from "../../../styles/navigatorBarStyles";
import {ArrowLeft} from "../../../assets/svg/illustrations";
import {CustomText} from "../../../highordercomponents";
import {Routes} from "../../Routes";

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
            id: route.params.points[0]?.sequence_uuid,
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
