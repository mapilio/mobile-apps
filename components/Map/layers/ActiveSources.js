import React, { Fragment } from 'react';
import * as MapLibre from '@maplibre/maplibre-react-native';

import Heading from '..//Heading';
import { tileConfig } from '../../../config/tileConfig';
import { toMapLibrePaint } from '../mapLibreStyle';

const ActiveSources = ({ pointInformation, clickedCoord }) => {
  return (
    <Fragment>
      <MapLibre.VectorSource id={'road-lines-stroke'} tiles={[tileConfig.roadUrl]}>
        <MapLibre.Layer
          type="line"
          id={'road-lines-stroke'}
          source-layer={tileConfig.roadId}
          filter={['all', ['==', 'sequence_uuid', pointInformation.sequenceID]]}
          paint={toMapLibrePaint({
            lineColor: '#0BBE3D',
            lineWidth: 5,
          })}
        />
      </MapLibre.VectorSource>
      <MapLibre.VectorSource
        id={'road-points-stroke'}
        tiles={[tileConfig.pointUrl]}
        minzoom={12}
        maxzoom={22}>
        <MapLibre.Layer
          type="circle"
          minzoom={16}
          id={'road-points-stroke-opacity'}
          source-layer={tileConfig.pointId}
          paint={toMapLibrePaint({
            circleColor: '#fff',
            circleRadius: 8,
            circleOpacity: 0.8,
          })}
          filter={['all', ['==', 'sequence_uuid', pointInformation.sequenceID]]}
        />
        <MapLibre.Layer
          type="circle"
          id={'road-points-stroke'}
          source-layer={tileConfig.pointId}
          paint={toMapLibrePaint({
            circleColor: '#0BBE3D',
            circleRadius: 6,
          })}
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
