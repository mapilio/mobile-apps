import React, {useState} from "react";
import {Dimensions, Image, View, TouchableOpacity} from "react-native";
import Maximize from "../assets/svg/illustrations/Maximize";
import {sequenceDetailStyles} from "../styles/userSequenceStyle";
import Minimize from "../assets/svg/illustrations/Minimize";
import {RFValue} from "react-native-responsive-fontsize";
import MapboxGL from "@react-native-mapbox-gl/maps";
import {appMapStyle} from "../styles/appMapStyle";

const UserSequence = ({route}) => {
  const [maximize, setMaximize] = useState(false);
  const screenHeight = Dimensions.get('window').height - RFValue(110);

  return (
    <View>
      <View style={sequenceDetailStyles.imageArea}>
        <Image
          source={{width: RFValue(200), height: RFValue(78), uri: `${route.params.path}`}}
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

      <MapboxGL.MapView
        styleURL={'mapbox://styles/mapbox/light-v10'}
        style={appMapStyle.map}
        attributionPosition={{bottom: 26, right: 8}}
      />
    </View>
  );
};

export default UserSequence;
