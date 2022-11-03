import React from 'react';
import {MapView} from "../../highordercomponents";
import {appMapStyle} from "../../styles/appMapStyle";
import MapboxGL from "@rnmapbox/maps";
import {Routes} from "../../navigator/Routes";
import {useDispatch, useSelector} from "react-redux";
import {MARKETPLACE_CENTER, ZOOM_LEVEL} from "../../store/actionsName";

const MarketplaceMap = ({centeredPoints, navigation}) => {
  const dispatch = useDispatch();
  const {auth} = useSelector((status) => status.getTokenReducer)
  const {marketplaceCenter, zoomLevel, marketplaceData} = useSelector((status) => status.marketplaceReducer);

  const _drawPolygon = (geoJson, navigation) => {
    if (Object.keys(geoJson).length) {
      return (
        <MapboxGL.ShapeSource
          id={"marketplacePolygon"}
          shape={geoJson}
          onPress={(project) => {
            if (auth) {
              navigation.navigate(Routes.marketplaceDetail, {
                data: project.features[0].properties,
              });
            } else {
              navigation.reset({index: 0, routes: [{name: Routes.login}]})
            }
          }}
        >
          <MapboxGL.FillLayer
            id={"marketplaceFillLayer"}
            minZoomLevel={8}
            style={{
              fillColor: "rgba(74, 144, 226, 0.4)",
              fillOutlineColor: "rgba(74, 144, 226, 1)"
            }}
          />
        </MapboxGL.ShapeSource>
      )
    }
  }
  const _pointing = (geoJson) => {
    if (Object.keys(geoJson).length) {
      return (
        <MapboxGL.ShapeSource
          id={"marketplaceShape"}
          shape={geoJson}
          onPress={(project) => {
            dispatch({type: MARKETPLACE_CENTER, payload: project.features[0].geometry.coordinates})
            dispatch({type: ZOOM_LEVEL, payload: 9})
          }}
        >
          <MapboxGL.SymbolLayer
            id={"marketplaceSymbol"}
            maxZoomLevel={8}
            style={{
              iconImage: require("../../assets/images/marketplaceMarker.png"),
              iconSize: 0.2,
            }}
          />
        </MapboxGL.ShapeSource>
      )
    }
  }

  return (
    <MapView
      mapStyle={appMapStyle.map}
      attributionStyle={{bottom: 41, right: 28}}
    >
      <MapboxGL.Camera centerCoordinate={marketplaceCenter} zoomLevel={zoomLevel}/>

      {_drawPolygon(marketplaceData, navigation)}
      {_pointing(centeredPoints)}

    </MapView>
  )
};

export default MarketplaceMap;
