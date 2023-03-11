import React from "react";
import {headingPointGeoJson} from "../../helper/helper";
import MapboxGL from "@rnmapbox/maps";

const Heading = ({heading, coordinates, markerPath}) => {

  return (
    <MapboxGL.ShapeSource
      id={"headingShape"}
      shape={headingPointGeoJson(heading, coordinates)}
    >
      <MapboxGL.SymbolLayer
        id={"heading"}
        style={{
          iconImage: markerPath,
          iconSize: 0.4,
          iconAllowOverlap: true,
          iconRotate: ["get", "rotate"],
          iconRotationAlignment: 'map',
        }}
      />
    </MapboxGL.ShapeSource>
  )
};

export default Heading;
