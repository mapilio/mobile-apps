import { Fragment } from "react";
import Config from "react-native-config";
import { styles } from "../../../styles/circleStyles";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { useSelector } from "react-redux";

const Lines = ({ zoomPoint }) => {
  const { maintenanceMode } = useSelector((state) => state.generalReducer);
  return (
    <Fragment>
      <MapLibreGL.VectorSource
        id={"road-lines"}
        tileUrlTemplates={[Config.MAPBOX_ROAD_URL]}
        onPress={(e) => {
          zoomPoint(e.coordinates)
        }}
      >
        <MapLibreGL.LineLayer
          id={"road-lines"}
          sourceLayerID={Config.MAPBOX_ROAD_ID}
          style={{...styles.lineStyles, lineColor: maintenanceMode ? "#fba63c" : "#146aff"}}
          belowLayerID={"road-points"}
        />
      </MapLibreGL.VectorSource>
    </Fragment>
  );
};

export default Lines;
