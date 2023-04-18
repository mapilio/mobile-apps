import React from "react";
import {headingPointGeoJson} from "../../helper/helper";
import {SymbolLayer, ShapeSource, Images} from "@rnmapbox/maps";

const Heading = ({heading, coordinates, markerPath}) => {

  return (
    <ShapeSource
      id={"headingShape"}
      shape={headingPointGeoJson(heading, coordinates)}
    >
      <Images
        images={{marker: markerPath}}
      />
      <SymbolLayer
        id={"heading"}
        style={{
          iconImage: "marker",
          iconSize: .4,
          iconAllowOverlap: true,
          iconRotate: ["get", "rotate"],
          iconRotationAlignment: 'map',
        }}
      />
    </ShapeSource>
  )
};

export default Heading;
