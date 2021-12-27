import React, {useState} from "react";
import { View, TouchableOpacity } from "react-native";
import { appMapStyle } from "../styles/appMapStyle";
import MapboxGL from "@react-native-mapbox-gl/maps";
import SearchIcon from "../assets/svg/illustrations/SearchIcon";
import Pano from "../components/Map/Pano";
import CurrentLocationIcon from "../assets/svg/illustrations/CurrentLocationIcon";
import MapAttributeAndLogo from "../components/Map/MapAttributeAndLogo";
import MinimizePano from "../assets/svg/illustrations/MinimizePano";
import PanoMinimize from "../assets/svg/illustrations/PanoMinimize";

MapboxGL.setAccessToken(
    "pk.eyJ1IjoiZGlhc2hhbGFiaSIsImEiOiJja3dwMjR6Y3IwOG5zMm9sMDVzYXl3dnNvIn0.pRISURiBok67zjI1B4jDhQ"
);

// const coordinates = [
//     [-73.98330688476561, 40.76975180901395],
//     [-73.96682739257812, 40.761560925502806],
//     [-74.00751113891602, 40.746346606483826],
//     [-73.95343780517578, 40.7849607714286],
//     [-73.99017333984375, 40.71135347314246],
//     [-73.98880004882812, 40.758960433915284],
//     [-73.96064758300781, 40.718379593199494],
//     [-73.95172119140624, 40.82731951134558],
//     [-73.9829635620117, 40.769101775774935],
//     [-73.9822769165039, 40.76273111352534],
//     [-73.98571014404297, 40.748947591479705]
// ]

const AppMap = ({ navigation }) => {
    const [showPano, setShowPano] = useState(true);

    const [minimizePano, setMinimizePano] = useState(false);

    const hidePano = () => {
        setShowPano(false);
    }

    const runMinimizePano = () => {
        setMinimizePano(true);
        hidePano();
    }

    const unminimizePano = () => {
        setMinimizePano(false);
        setShowPano(true);
    }

    // function renderAnnotation(counter) {
    //     const id = `pointAnnotation${counter}`;
    //     const coordinate = coordinates[counter];
    //     const title = `Longitude: ${coordinates[counter][0]} Latitude: ${coordinates[counter][1]}`;
    //
    //     return (
    //         <MapboxGL.PointAnnotation
    //             key={id}
    //             id={id}
    //             title='Test'
    //             coordinate={coordinate}>
    //
    //             {/*<Image*/}
    //             {/*    source={require('../common/images/marker.png')}*/}
    //             {/*    style={{*/}
    //             {/*        flex: 1,*/}
    //             {/*        resizeMode: 'contain',*/}
    //             {/*        width: 25,*/}
    //             {/*        height: 25*/}
    //             {/*    }}/>*/}
    //         </MapboxGL.PointAnnotation>
    //     );
    // }
    //
    // function renderAnnotations() {
    //     const items = [];
    //
    //     for (let i = 0; i < coordinates.length; i++) {
    //         items.push(renderAnnotation(i));
    //     }
    //
    //     return items;
    // }

  return (
    <View>
        {showPano ?
            <Pano hidePano={hidePano} minimizePano={runMinimizePano} /> :
            <View style={appMapStyle.searchIcon}>
                <SearchIcon width={19.55} height={19.55} />
            </View>
        }

        {minimizePano ?
            <TouchableOpacity style={appMapStyle.minimizePano} onPress={unminimizePano}>
                <PanoMinimize />
            </TouchableOpacity> : null
        }

        <View style={appMapStyle.mapWrapper}>
            <MapboxGL.MapView
                styleURL={'mapbox://styles/mapbox/light-v10'}
                style={appMapStyle.map}
            >
                <MapboxGL.UserLocation
                    ref={(location) => location}
                />

                {/*{renderAnnotations()}*/}

                <MapboxGL.Camera followUserLocation={true} />
            </MapboxGL.MapView>
        </View>

        <View style={appMapStyle.currentIcon}>
            <CurrentLocationIcon />
        </View>

        <MapAttributeAndLogo />
    </View>
  );
};

export default AppMap;
