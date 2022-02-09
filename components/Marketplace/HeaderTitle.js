import React from "react";
import { Dimensions, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Marketplace from "../../assets/svg/illustrations/Marketplace";

const HeaderTitle = () => {
  return (
    <View
      style={{
        marginBottom: Dimensions.get("window").height > 1100 ? RFValue(-10) : 0,
      }}
    >
      <Marketplace />
    </View>
  );
};

export default HeaderTitle;
