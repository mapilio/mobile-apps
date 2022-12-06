import React, {useEffect, useRef} from 'react';
import {MapView} from "../../highordercomponents";
import {appMapStyle} from "../../styles/appMapStyle";
import MapboxGL from "@rnmapbox/maps";
import {useSelector} from "react-redux";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Dimensions} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";

const MarketplaceMap = ({navigation}) => {
  const {bottom} = useSafeAreaInsets();
  const {marketplaceCenter, zoomLevel, marketplaceData} = useSelector((status) => status.marketplaceReducer);
  const camera = useRef();

  useEffect(() => {
    camera.current?.setCamera({centerCoordinate: marketplaceCenter, zoomLevel: zoomLevel})
  }, [marketplaceCenter, zoomLevel]);

  const _drawPolygon = (geoJson) => {
    if (Object.keys(geoJson).length) {
      return (
        <MapboxGL.ShapeSource id={"marketplacePolygon"} shape={geoJson}>
          <MapboxGL.FillLayer
            id={"marketplaceFillLayer"}
            style={{fillColor: "rgba(74, 144, 226, 0.4)", fillOutlineColor: "rgba(74, 144, 226, 1)"}}
          />
        </MapboxGL.ShapeSource>
      )
    }
  }

  return (
    <MapView mapStyle={{...appMapStyle.map, height: Dimensions.get("window").height - bottom - RFValue(63)}}>
      <MapboxGL.Camera ref={camera}/>
      {_drawPolygon(marketplaceData, navigation)}
    </MapView>
  )
};

export default MarketplaceMap;
