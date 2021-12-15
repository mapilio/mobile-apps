import React, {useState} from "react";
import { View } from "react-native";
import { appMapStyle } from "../styles/appMapStyle";
import MapboxGL from "@react-native-mapbox-gl/maps";
import SearchIcon from "../assets/svg/illustrations/SearchIcon";
import Pano from "../components/Map/Pano";

MapboxGL.setAccessToken(
    "pk.eyJ1IjoiZGlhc2hhbGFiaSIsImEiOiJja3dwMjR6Y3IwOG5zMm9sMDVzYXl3dnNvIn0.pRISURiBok67zjI1B4jDhQ"
);

const AppMap = ({ navigation }) => {
    const [showPano, setShowPano] = useState(false);

  return (
    <View>
        {showPano ?
            <Pano /> :
            <View style={appMapStyle.searchIcon}>
                <SearchIcon width={19.55} height={19.55} />
            </View>
        }

      <MapboxGL.MapView
          styleURL={'mapbox://styles/mapbox/light-v10'}
          style={appMapStyle.map}
          attributionPosition={{bottom: 26, right: 8}}
      />
    </View>
  );
};

export default AppMap;
