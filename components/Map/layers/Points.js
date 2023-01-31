import { Fragment } from "react";
import Config from "react-native-config";
import { styles } from "../../../styles/circleStyles";
import MapboxGL from "@rnmapbox/maps";

const Points = ({touchPoint}) => {
  return (
    <Fragment>
      <MapboxGL.VectorSource
        id={"road-points"}
        tileUrlTemplates={[Config.MAPBOX_POINT_URL]}
        onPress={touchPoint}
      >
        <MapboxGL.CircleLayer
          id={"road-points"}
          sourceLayerID={Config.MAPBOX_POINT_ID}
          style={styles.circles}
          minZoomLevel={14}
        />
      </MapboxGL.VectorSource>

      <MapboxGL.VectorSource
        id={"road-points-opacity"}
        tileUrlTemplates={[Config.MAPBOX_POINT_URL]}
      >
        <MapboxGL.CircleLayer
          id={"road-points-opacity"}
          sourceLayerID={Config.MAPBOX_POINT_ID}
          style={styles.circlesOpacity}
          maxZoomLevel={15}
        />
      </MapboxGL.VectorSource>
    </Fragment>
  );
};

export default Points;
