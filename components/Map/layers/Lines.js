import { Fragment } from "react";

import { styles } from "../../../styles/circleStyles";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { useSelector } from "react-redux";
import { tileConfig } from "../../../config/tileConfig";

const Lines = ({ zoomPoint }) => {
  const { maintenanceMode } = useSelector((state) => state.generalReducer);
  return (
    <Fragment>
      <MapLibreGL.VectorSource
        id={"road-lines"}
        tileUrlTemplates={[tileConfig.roadUrl]}
        onPress={(e) => {
          zoomPoint(e.coordinates)
        }}
      >
        <MapLibreGL.LineLayer
          id={"road-lines"}
          sourceLayerID={tileConfig.roadId}
          style={{...styles.lineStyles, lineColor: maintenanceMode ? "#fba63c" : "#146aff"}}
          belowLayerID={"road-points"}
        />
      </MapLibreGL.VectorSource>
    </Fragment>
  );
};

export default Lines;
