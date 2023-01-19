import React from "react";
import {RFValue} from "react-native-responsive-fontsize";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Routes} from "../../Routes";
import {Cog} from "../../../assets/svg/illustrations";
import {useNavigation} from "@react-navigation/native";

const ProfileNavigatorRight = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate(Routes.profileSettings)}>
      <Cog width={RFValue(20)}/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingsButton: {
    marginRight: RFValue(28)
  }
})

export default ProfileNavigatorRight;
