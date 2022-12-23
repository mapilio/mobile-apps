import React from "react";
import {TouchableOpacity} from "react-native";
import {ArrowLeft} from "../../../assets/svg/illustrations";
import {CustomText} from "../../../highordercomponents";
import {sequenceLeft} from "../../../styles/navigatorBarStyles";
import {Routes} from "../../Routes";

const SequenceNavigatorLeft = ({navigation}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={sequenceLeft.container}
      onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate(Routes.profile)}
    >
      <ArrowLeft color={'#D8D8D8'}/>
      <CustomText style={sequenceLeft.backTitle}>Back</CustomText>
    </TouchableOpacity>
  );
};

export default SequenceNavigatorLeft;
