import React from "react";
import {View, Dimensions, Image} from "react-native";
import SlidingUpPanel from "rn-sliding-up-panel";
import {RFValue} from "react-native-responsive-fontsize";
import {List} from "../components/Marketplace";

const {height} = Dimensions.get('window')

const Marketplace = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <Image
        source={require("../assets/images/marketplaceMap.png")}
        resizeMode={"cover"}
      />

      <SlidingUpPanel
        draggableRange={{top: height - RFValue(100), bottom: 60}}
        showBackdrop={false}>
        <List navigation={navigation} />
      </SlidingUpPanel>
    </View>
  );
};

export default Marketplace;
