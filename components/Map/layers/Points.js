import { Fragment } from 'react';

import { styles } from '../../../styles/circleStyles';
import * as MapLibre from '@maplibre/maplibre-react-native';
import { useSelector } from 'react-redux';
import { tileConfig } from '../../../config/tileConfig';
import { toMapLibrePaint } from '../mapLibreStyle';

const Points = ({ touchPoint }) => {
  const { maintenanceMode } = useSelector((state) => state.generalReducer);
  return (
    <Fragment>
      <MapLibre.VectorSource
        id={'road-points'}
        tiles={[tileConfig.pointUrl]}
        minzoom={12}
        maxzoom={22}
        onPress={(e) => {
          if (!maintenanceMode) {
            touchPoint(e.nativeEvent);
          }
        }}>
        <MapLibre.Layer
          type="circle"
          id={'road-points'}
          source-layer={tileConfig.pointId}
          paint={toMapLibrePaint({
            ...styles.circles,
            circleColor: maintenanceMode ? '#fba63c' : '#146aff',
          })}
          beforeId={'road-points-opacity'}
          minzoom={12}
        />
        <MapLibre.Layer
          type="circle"
          id={'road-points-opacity'}
          source-layer={tileConfig.pointId}
          paint={toMapLibrePaint({
            ...styles.circlesOpacity,
            circleColor: maintenanceMode ? '#fba63c' : '#146aff',
            circleStrokeColor: maintenanceMode ? '#fba63c' : '#146aff',
          })}
          minzoom={17}
        />
      </MapLibre.VectorSource>
    </Fragment>
  );
};

export default Points;
