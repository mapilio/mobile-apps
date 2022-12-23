import React from "react";
import {TouchableOpacity} from "react-native";
import {ArrowLeft} from "../../../assets/svg/illustrations";
import {CustomText} from "../../../highordercomponents";
import {sequenceLeft} from "../../../styles/navigatorBarStyles";
import {Routes} from "../../Routes";
import {useNavigation} from "@react-navigation/native";

const ProfileSettingsNavigatorLeft = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={sequenceLeft.container}
      onPress={() => {
        navigation.canGoBack() ? navigation.goBack() : navigation.navigate('ProfileTab', {screen: Routes.profile})
      }}
    >
      <ArrowLeft color={'#D8D8D8'}/>
      <CustomText style={sequenceLeft.backTitle}>Back</CustomText>
    </TouchableOpacity>
  );
};

export default ProfileSettingsNavigatorLeft;
