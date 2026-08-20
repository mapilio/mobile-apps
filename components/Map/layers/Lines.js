import { Fragment } from 'react';

import { styles } from '../../../styles/circleStyles';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useSelector } from 'react-redux';
import { tileConfig } from '../../../config/tileConfig';
import { toMapLibrePaint } from '../mapLibreStyle';

const Lines = ({ zoomPoint }) => {
  const { maintenanceMode } = useSelector((state) => state.generalReducer);
  return (
    <Fragment>
      <MapLibreGL.VectorSource
        id={'road-lines'}
        tiles={[tileConfig.roadUrl]}
        onPress={(e) => {
          zoomPoint(e.nativeEvent.lngLat);
        }}>
        <MapLibreGL.Layer
          type="line"
          id={'road-lines'}
          source-layer={tileConfig.roadId}
          paint={toMapLibrePaint({
            ...styles.lineStyles,
            lineColor: maintenanceMode ? '#fba63c' : '#146aff',
          })}
          beforeId={'road-points'}
        />
      </MapLibreGL.VectorSource>
    </Fragment>
  );
};

export default Lines;
