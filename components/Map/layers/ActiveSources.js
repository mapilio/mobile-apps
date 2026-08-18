import React, { Fragment } from 'react';
import MapLibre from '@maplibre/maplibre-react-native';

import Heading from '..//Heading';
import { tileConfig } from '../../../config/tileConfig';

const ActiveSources = ({ pointInformation, clickedCoord }) => {
  return (
    <Fragment>
      <MapLibre.VectorSource id={'road-lines-stroke'} tileUrlTemplates={[tileConfig.roadUrl]}>
        <MapLibre.LineLayer
          id={'road-lines-stroke'}
          sourceLayerID={tileConfig.roadId}
          filter={['all', ['==', 'sequence_uuid', pointInformation.sequenceID]]}
          style={{
            lineColor: '#0BBE3D',
            lineWidth: 5,
          }}
        />
      </MapLibre.VectorSource>
      <MapLibre.VectorSource
        id={'road-points-stroke'}
        tileUrlTemplates={[tileConfig.pointUrl]}
        minZoomLevel={12}
        maxZoomLevel={22}>
        <MapLibre.CircleLayer
          minZoomLevel={16}
          id={'road-points-stroke-opacity'}
          sourceLayerID={tileConfig.pointId}
          style={{
            circleColor: '#fff',
            circleRadius: 8,
            circleOpacity: 0.8,
          }}
          filter={['all', ['==', 'sequence_uuid', pointInformation.sequenceID]]}
        />
        <MapLibre.CircleLayer
          id={'road-points-stroke'}
          sourceLayerID={tileConfig.pointId}
          style={{
            circleColor: '#0BBE3D',
            circleRadius: 6,
          }}
          filter={['all', ['==', 'sequence_uuid', pointInformation.sequenceID]]}
        />
      </MapLibre.VectorSource>
      <Heading
        heading={pointInformation ? pointInformation.heading : 0}
        coordinates={clickedCoord}
        markerPath={require('../../../assets/images/heading.png')}
      />
    </Fragment>
  );
};
export default ActiveSources;
