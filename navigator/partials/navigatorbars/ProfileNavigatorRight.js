import React from "react";
import {RFValue} from "react-native-responsive-fontsize";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Routes} from "../../Routes";
import {SettingsDots} from "../../../assets/svg/illustrations";

const ProfileNavigatorRight = ({ navigation }) => {
  return (
    <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate(Routes.profileSettings)}>
      <SettingsDots width={RFValue(12)}/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingsButton: {
    backgroundColor: '#FFFFFF1A',
    borderRadius: RFValue(20),
    width: RFValue(24),
    height: RFValue(24),
    alignItems: "center",
    justifyContent: "center",
    marginRight: RFValue(28),
  }
})

export default ProfileNavigatorRight;
