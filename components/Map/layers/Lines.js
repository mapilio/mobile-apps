import { Fragment } from "react";
import Config from "react-native-config";
import { styles } from "../../../styles/circleStyles";
import MapLibreGL from "@maplibre/maplibre-react-native";

const Lines = ({ zoomPoint }) => {
  return (
    <Fragment>
      <MapLibreGL.VectorSource
        id={"road-lines"}
        tileUrlTemplates={[Config.MAPBOX_ROAD_URL]}
        onPress={(e) => zoomPoint(e.features[0].geometry.coordinates[0])}
      >
        <MapLibreGL.LineLayer
          id={"road-lines"}
          sourceLayerID={Config.MAPBOX_ROAD_ID}
          style={styles.lineStyles}
          belowLayerID={"road-points"}
        />
      </MapLibreGL.VectorSource>
    </Fragment>
  );
};

export default Lines;
