import React from "react";
import {headingPointGeoJson} from "../../helper/helper";
import MapboxGL from "@rnmapbox/maps";

const Heading = ({heading, coordinates, markerPath}) => {

  // TODO this icon image crashes on ios
  return (
    <></>
/*
    <MapboxGL.ShapeSource
      id={"headingShape"}
      shape={headingPointGeoJson(heading, coordinates)}
    >

      <MapboxGL.SymbolLayer
        id='headingSymbol'
        style={{
          // iconImage: markerPath,
          iconSize: 1,
          iconAllowOverlap: true,
          iconRotate: ["get", "rotate"],
          iconRotationAlignment: 'map',
        }}
        layerIndex={90}
        />
    </MapboxGL.ShapeSource>
*/
  )
};

export default Heading;
