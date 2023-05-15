import React, {useEffect, useRef} from 'react';
import {MapView} from "../../highordercomponents";
import {appMapStyle} from "../../styles/appMapStyle";
import MapLibre from "@maplibre/maplibre-react-native";
import {useSelector} from "react-redux";
import { Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const MarketplaceMap = ({navigation, onDidFinishLoadingMap}) => {
  const {marketplaceCenter, zoomLevel, marketplaceData} = useSelector((status) => status.marketplaceReducer);
  const camera = useRef();

  useEffect(() => {
    camera.current?.setCamera({centerCoordinate: marketplaceCenter, zoomLevel: zoomLevel})
  }, [marketplaceCenter, zoomLevel]);

  const _drawPolygon = (geoJson) => {
    if (Object.keys(geoJson).length) {
      return (
        <MapLibre.ShapeSource id={"marketplacePolygon"} shape={geoJson}>
          <MapLibre.FillLayer
            id={"marketplaceFillLayer"}
            style={{fillColor: "rgba(74, 144, 226, 0.4)", fillOutlineColor: "rgba(74, 144, 226, 1)"}}
          />
        </MapLibre.ShapeSource>
      )
    }
  }

  const attributionStyles = {
    left:Platform.OS === "ios" ? 0 : RFValue(10),
    bottom: Platform.isPad ? RFValue(29) : RFValue(35),
  };


  return (
    <MapView mapStyle={appMapStyle.map} onDidFinishLoadingMap={onDidFinishLoadingMap} attributionStyle={attributionStyles}>
      <MapLibre.Camera animationMode={"moveTo"} ref={camera}/>
      {_drawPolygon(marketplaceData, navigation)}
    </MapView>
  )
};

export default MarketplaceMap;
