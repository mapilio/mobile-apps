import { Fragment } from "react";

import { styles } from "../../../styles/circleStyles";
import MapLibre from "@maplibre/maplibre-react-native";
import { useSelector } from "react-redux";


const Points = ({touchPoint}) => {
  const {maintenanceMode} = useSelector((state) => state.generalReducer);

  return (
    <Fragment>
      <MapLibre.VectorSource
        id={"road-points"}
        tileUrlTemplates={[process.env.EXPO_PUBLIC_MAPBOX_POINT_URL]}
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
          sourceLayerID={process.env.EXPO_PUBLIC_MAPBOX_POINT_ID}
          style={{...styles.circles, circleColor: maintenanceMode ? "#fba63c" : "#146aff"}}
          belowLayerID={"road-points-opacity"}
          minZoomLevel={12}
        />
        <MapLibre.CircleLayer
          id={"road-points-opacity"}
          sourceLayerID={process.env.EXPO_PUBLIC_MAPBOX_POINT_ID}
          style={{...styles.circlesOpacity, circleColor: maintenanceMode ? "#fba63c" : "#146aff", circleStrokeColor: maintenanceMode ? "#fba63c" : "#146aff"}}
          minZoomLevel={17}
        />
      </MapLibre.VectorSource>
     
    </Fragment>
  );
};

export default Points;
