import { Fragment } from "react";
import Config from "react-native-config";
import { styles } from "../../../styles/circleStyles";
import MapLibre from "@maplibre/maplibre-react-native";

const Points = ({touchPoint}) => {
  return (
    <Fragment>
      <MapLibre.VectorSource
        id={"road-points"}
        tileUrlTemplates={[Config.MAPBOX_POINT_URL]}
        onPress={touchPoint}
      >
        <MapLibre.CircleLayer
          id={"road-points"}
          sourceLayerID={Config.MAPBOX_POINT_ID}
          style={styles.circles}
          minZoomLevel={14}
        />
      </MapLibre.VectorSource>

      <MapLibre.VectorSource
        id={"road-points-opacity"}
        tileUrlTemplates={[Config.MAPBOX_POINT_URL]}
      >
        <MapLibre.CircleLayer
          id={"road-points-opacity"}
          sourceLayerID={Config.MAPBOX_POINT_ID}
          style={styles.circlesOpacity}
          maxZoomLevel={15}
        />
      </MapLibre.VectorSource>
    </Fragment>
  );
};

export default Points;
