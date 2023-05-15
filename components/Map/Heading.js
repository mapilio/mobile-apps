import React from "react";
import {headingPointGeoJson} from "../../helper/helper";
import MapLibreGL from "@maplibre/maplibre-react-native";

const Heading = ({heading, coordinates, markerPath}) => {
  return (
    <MapLibreGL.ShapeSource
      id={"headingShape"}
      shape={headingPointGeoJson(heading, coordinates)}
    >
      <MapLibreGL.SymbolLayer
        id={"heading"}
        style={{
          iconImage: markerPath,
          iconSize: .4,
          iconAllowOverlap: true,
          iconRotate: ["get", "rotate"],
          iconRotationAlignment: 'map',
        }}
      />
    </MapLibreGL.ShapeSource>
  )
};

export default Heading;
