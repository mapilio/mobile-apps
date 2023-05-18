import { Fragment } from "react";
import Config from "react-native-config";
import { styles } from "../../../styles/circleStyles";
import MapLibre from "@maplibre/maplibre-react-native";
import { useSelector } from "react-redux";


const Points = ({touchPoint}) => {

  const {maintenanceMode} = useSelector((state) => state.generalReducer);

  return (
    <Fragment>
      <MapLibre.VectorSource
        id={"road-points"}
        tileUrlTemplates={[Config.MAPBOX_POINT_URL]}
        onPress={(e)=>{
          if(!maintenanceMode){
            touchPoint(e)
          }
        }}
      >
        <MapLibre.CircleLayer
          id={"road-points"}
          sourceLayerID={Config.MAPBOX_POINT_ID}
          style={{...styles.circles, circleColor: maintenanceMode ? "#fba63c" : "#146aff"}}
          belowLayerID={"road-points-opacity"}
          minZoomLevel={12}
        />
      </MapLibre.VectorSource>
      <MapLibre.VectorSource
        id={"road-points-opacity"}
        tileUrlTemplates={[Config.MAPBOX_POINT_URL]}
      >
        <MapLibre.CircleLayer
          id={"road-points-opacity"}
          sourceLayerID={Config.MAPBOX_POINT_ID}
          style={{...styles.circlesOpacity, circleColor: maintenanceMode ? "#fba63c" : "#146aff", circleStrokeColor: maintenanceMode ? "#fba63c" : "#146aff"}}
          minZoomLevel={17}
          maxZoomLevel={12}
        />
      </MapLibre.VectorSource>
     
    </Fragment>
  );
};

export default Points;
