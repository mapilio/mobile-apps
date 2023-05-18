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
          belowLayerID={"road-points-opacity"}
          //only shows zoom 14 and above
          minZoomLevel={13}
        />
        <MapLibre.CircleLayer
          id={"road-points-opacity"}
          sourceLayerID={Config.MAPBOX_POINT_ID}
          style={styles.circlesOpacity}
          minZoomLevel={13}
          maxZoomLevel={17}
         
        />
      </MapLibre.VectorSource>

     
    </Fragment>
  );
};

export default Points;
