import React, { Fragment } from "react";
import MapboxGL from "@rnmapbox/maps";
import Config from "react-native-config";
import Heading from "..//Heading";

const ActiveSources = ({ imageInformations, clickedCoord }) => {
  return (
    <Fragment>
      <MapboxGL.VectorSource
        id={"road-lines-stroke"}
        tileUrlTemplates={[Config.MAPBOX_ROAD_URL]}
      >
        <MapboxGL.LineLayer
          id={"road-lines-stroke"}
          sourceLayerID={Config.MAPBOX_ROAD_ID}
          filter={[
            "all",
            ["==", "sequence_uuid", imageInformations.sequenceID],
          ]}
          style={{
            lineColor: "#0BBE3D",
            lineWidth: 5,
          }}
        />
      </MapboxGL.VectorSource>
      <MapboxGL.VectorSource
        id={"road-points-stroke"}
        tileUrlTemplates={[Config.MAPBOX_POINT_URL]}
      >
        <MapboxGL.CircleLayer
          minZoomLevel={16}
          id={"road-points-stroke-opacity"}
          sourceLayerID={Config.MAPBOX_POINT_ID}
          style={{
            circleColor: "#fff",
            circleRadius: 8,
            circleOpacity: 0.8,
          }}
          filter={[
            "all",
            ["==", "sequence_uuid", imageInformations.sequenceID],
          ]}

        />
        <MapboxGL.CircleLayer
          id={"road-points-stroke"}
          sourceLayerID={Config.MAPBOX_POINT_ID}
          style={{
            circleColor: "#0BBE3D",
            circleRadius: 6,
          }}
          filter={[
            "all",
            ["==", "sequence_uuid", imageInformations.sequenceID],
          ]}
        />
      </MapboxGL.VectorSource>
      <Heading
        heading={imageInformations ? imageInformations.heading : 0}
        coordinates={clickedCoord}
        markerPath={require("../../../assets/images/heading.png")}
      />
    </Fragment>
  );
};
export default ActiveSources;
