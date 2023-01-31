import React, { Fragment } from "react";
import MapboxGL from "@rnmapbox/maps";
import Config from "react-native-config";
import Heading from "..//Heading";

const ActiveSources = ({ imageInformations, clickedCoord }) => {
  return (
    <Fragment>
      <MapboxGL.VectorSource
        id={"road-points-stroke"}
        tileUrlTemplates={[Config.MAPBOX_POINT_URL]}
      >
        <MapboxGL.CircleLayer
          id={"road-points-stroke"}
          sourceLayerID={Config.MAPBOX_POINT_ID}
          style={{
            circleColor: "#1AD971",
            circleStrokeWidth: 2,
            circleStrokeColor: "#1AD971",
          }}
          filter={[
            "all",
            ["==", "sequence_uuid", imageInformations.sequenceID],
          ]}
        />
      </MapboxGL.VectorSource>

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
            lineColor: "#1AD971",
            lineWidth: 5,
          }}
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
