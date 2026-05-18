import React, { Fragment } from 'react';
import MapLibre from '@maplibre/maplibre-react-native';

import Heading from '..//Heading';

const ActiveSources = ({ pointInformation, clickedCoord }) => {
  return (
    <Fragment>
      <MapLibre.VectorSource
        id={'road-lines-stroke'}
        tileUrlTemplates={[process.env.EXPO_PUBLIC_MAPBOX_ROAD_URL]}>
        <MapLibre.LineLayer
          id={'road-lines-stroke'}
          sourceLayerID={process.env.EXPO_PUBLIC_MAPBOX_ROAD_ID}
          filter={['all', ['==', 'sequence_uuid', pointInformation.sequenceID]]}
          style={{
            lineColor: '#0BBE3D',
            lineWidth: 5,
          }}
        />
      </MapLibre.VectorSource>
      <MapLibre.VectorSource
        id={'road-points-stroke'}
        tileUrlTemplates={[process.env.EXPO_PUBLIC_MAPBOX_POINT_URL]}>
        <MapLibre.CircleLayer
          minZoomLevel={16}
          id={'road-points-stroke-opacity'}
          sourceLayerID={process.env.EXPO_PUBLIC_MAPBOX_POINT_ID}
          style={{
            circleColor: '#fff',
            circleRadius: 8,
            circleOpacity: 0.8,
          }}
          filter={['all', ['==', 'sequence_uuid', pointInformation.sequenceID]]}
        />
        <MapLibre.CircleLayer
          id={'road-points-stroke'}
          sourceLayerID={process.env.EXPO_PUBLIC_MAPBOX_POINT_ID}
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
