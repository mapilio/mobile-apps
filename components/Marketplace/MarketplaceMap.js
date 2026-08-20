import React, { useEffect, useRef } from 'react';
import { MapView } from '../../highordercomponents';
import { appMapStyle } from '../../styles/appMapStyle';
import MapLibre from '@maplibre/maplibre-react-native';
import { useSelector } from 'react-redux';

const MarketplaceMap = ({ navigation, onDidFinishLoadingMap }) => {
  const { marketplaceCenter, zoomLevel, marketplaceData } = useSelector(
    (status) => status.marketplaceReducer
  );
  const camera = useRef();

  useEffect(() => {
    camera.current?.setStop({
      center: marketplaceCenter,
      zoom: zoomLevel,
      duration: 100,
    });
  }, [marketplaceCenter, zoomLevel]);

  const _drawPolygon = (geoJson) => {
    if (Object.keys(geoJson).length) {
      return (
        <MapLibre.GeoJSONSource id={'marketplacePolygon'} data={geoJson}>
          <MapLibre.Layer
            type="fill"
            id={'marketplaceFillLayer'}
            paint={{
              'fill-color': 'rgba(74, 144, 226, 0.4)',
              'fill-outline-color': 'rgba(74, 144, 226, 1)',
            }}
          />
        </MapLibre.GeoJSONSource>
      );
    }
  };

  return (
    <MapView mapStyle={appMapStyle.map} onDidFinishLoadingMap={onDidFinishLoadingMap}>
      <MapLibre.Camera easing={'fly'} ref={camera} zoom={3} />
      {_drawPolygon(marketplaceData, navigation)}
    </MapView>
  );
};

export default MarketplaceMap;
