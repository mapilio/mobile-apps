import React from "react";
import {headingPointGeoJson} from "../../helper/helper";
import MapboxGL from "@rnmapbox/maps";
import {RFValue} from "react-native-responsive-fontsize";

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
          iconSize: .4,
          iconAllowOverlap: true,
          iconRotate: ["get", "rotate"],
          iconRotationAlignment: 'map',
        }}
      />
    </MapboxGL.ShapeSource>
  )
};

export default Heading;
