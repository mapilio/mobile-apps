import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Maximize from "../assets/svg/illustrations/Maximize";
import { sequenceDetailStyles } from "../styles/userSequenceStyle";
import Minimize from "../assets/svg/illustrations/Minimize";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { appMapStyle } from "../styles/appMapStyle";
import { MapView } from "../highordercomponents";
import { useDispatch } from "react-redux";
import { UPDATE_CURRENT_FEED_SEQUENCE } from "../store/actionsName";

const ProfileUploadDetail = ({ navigation, route }) => {
  const screenHeight = Dimensions.get("window").height - RFValue(110);
  const [maximize, setMaximize] = useState(false);

  return (
    <View>
      <View style={sequenceDetailStyles.imageArea}>
        <Image
          source={{
            width: RFValue(200),
            height: RFValue(78),
            uri: `${route.params.path}`,
          }}
          resizeMode={"cover"}
          style={{
            ...sequenceDetailStyles.image,
            height: maximize ? screenHeight : screenHeight / 2,
          }}
        />
        <View
          style={[
            sequenceDetailStyles.resizeButton,
            maximize
              ? sequenceDetailStyles.maximizeButton
              : sequenceDetailStyles.minimizeButton,
          ]}
        >
          <TouchableOpacity onPress={() => setMaximize(!maximize)}>
            {maximize ? <Minimize /> : <Maximize />}
          </TouchableOpacity>
        </View>
      </View>

      <MapView
        mapStyle={{ ...appMapStyle.map, height: RFPercentage(54) }}
        attributionPosition={{ bottom: 26, right: 8 }}
      >
        <MapboxGL.Camera
          zoomLevel={1}
          animationMode={"flyTo"}
          animationDuration={1000}
        />
      </MapView>
    </View>
  );
};

export default ProfileUploadDetail;
