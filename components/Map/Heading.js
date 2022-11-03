import React from "react";
import {headingPointGeoJson} from "../../helper/helper";
import MapboxGL from "@rnmapbox/maps";

const Heading = ({heading, coordinates, markerPath}) => {
  return (
    <MapboxGL.ShapeSource
      id={"headingShape"}
      shape={headingPointGeoJson(heading, coordinates)}
    >
      // TODO this icon image crashes on ios
      {/*<MapboxGL.SymbolLayer
        id='headingSymbol'
        style={{
          iconImage: markerPath,
          iconSize: 1,
          iconAllowOverlap: true,
          iconRotate: ["get", "rotate"],
          iconRotationAlignment: 'map',
        }}
        layerIndex={90}
        />*/}
    </MapboxGL.ShapeSource>
  )
};

export default Heading;
