import { Fragment } from "react";

import { styles } from "../../../styles/circleStyles";
import MapLibre from "@maplibre/maplibre-react-native";
import { useSelector } from "react-redux";
import { tileConfig } from "../../../config/tileConfig";


const Points = ({touchPoint}) => {
  const {maintenanceMode} = useSelector((state) => state.generalReducer);
  return (
    <Fragment>
      <MapLibre.VectorSource
        id={"road-points"}
        tileUrlTemplates={[tileConfig.pointUrl]}
        minZoomLevel={12}
        maxZoomLevel={22}
        onPress={(e)=>{
          if(!maintenanceMode){
            touchPoint(e)
          }
        }}
      >
        <MapLibre.CircleLayer
          id={"road-points"}
          sourceLayerID={tileConfig.pointId}
          style={{...styles.circles, circleColor: maintenanceMode ? "#fba63c" : "#146aff"}}
          belowLayerID={"road-points-opacity"}
          minZoomLevel={12}
        />
        <MapLibre.CircleLayer
          id={"road-points-opacity"}
          sourceLayerID={tileConfig.pointId}
          style={{...styles.circlesOpacity, circleColor: maintenanceMode ? "#fba63c" : "#146aff", circleStrokeColor: maintenanceMode ? "#fba63c" : "#146aff"}}
          minZoomLevel={17}
        />
      </MapLibre.VectorSource>
     
    </Fragment>
  );
};

export default Points;
