import { Fragment } from "react";
import Config from "react-native-config";
import { styles } from "../../../styles/circleStyles";
import MapboxGL from "@rnmapbox/maps";

const Lines = ({ zoomPoint }) => {
  return (
    <Fragment>
      <MapboxGL.VectorSource
        id={"road-lines"}
        tileUrlTemplates={[Config.MAPBOX_ROAD_URL]}
        onPress={(e) => zoomPoint(e.features[0].geometry.coordinates[0])}
      >
        <MapboxGL.LineLayer
          id={"road-lines"}
          sourceLayerID={Config.MAPBOX_ROAD_ID}
          style={styles.lineStyles}
        />
      </MapboxGL.VectorSource>
    </Fragment>
  );
};

export default Lines;
