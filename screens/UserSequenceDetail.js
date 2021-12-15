import React, {useState} from "react";
import {Dimensions, Image, View, TouchableOpacity} from "react-native";
import Maximize from "../assets/svg/illustrations/Maximize";
import {sequenceDetailStyles} from "../styles/userSequenceStyle";
import Minimize from "../assets/svg/illustrations/Minimize";
import {RFValue} from "react-native-responsive-fontsize";

const UserSequence = ({navigation}) => {

  const [maximize, setMaximize] = useState(false);
  const screenHeight = Dimensions.get('window').height - RFValue(110);

  return (
    <View>
      <View style={sequenceDetailStyles.imageArea}>
        <Image
          source={require("../assets/images/car.png")}
          resizeMode={"cover"}
          style={{
            ...sequenceDetailStyles.image,
            height: maximize ? screenHeight : screenHeight / 2,
          }}
        />
        <View style={sequenceDetailStyles.resizeButton}>
          <TouchableOpacity onPress={() => setMaximize(!maximize)}>
            {
              maximize ? <Minimize /> : <Maximize />
            }
          </TouchableOpacity>
        </View>
      </View>
      <Image
        source={require("../assets/images/map.png")}
        resizeMode={"cover"}
      />
    </View>
  );
};

export default UserSequence;
