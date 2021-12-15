import React from "react";
import {Image, View} from "react-native";
import {panoStyle} from "../../styles/panoStyle";

const Pano = () => {
  return (
      <View>
          <Image
              source={require("../../assets/images/pano.png")}
              style={panoStyle.imageStyle}
          />
      </View>
  );
};

export default Pano;
