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
    camera.current?.setCamera({
      centerCoordinate: marketplaceCenter,
      zoomLevel: zoomLevel,
      animationDuration: 100,
    });
  }, [marketplaceCenter, zoomLevel]);

  const _drawPolygon = (geoJson) => {
    if (Object.keys(geoJson).length) {
      return (
        <MapLibre.ShapeSource id={'marketplacePolygon'} shape={geoJson}>
          <MapLibre.FillLayer
            id={'marketplaceFillLayer'}
            style={{
              fillColor: 'rgba(74, 144, 226, 0.4)',
              fillOutlineColor: 'rgba(74, 144, 226, 1)',
            }}
          />
        </MapLibre.ShapeSource>
      );
    }
  };

  return (
    <MapView mapStyle={appMapStyle.map} onDidFinishLoadingMap={onDidFinishLoadingMap}>
      <MapLibre.Camera animationMode={'flyTo'} ref={camera} zoomLevel={3} />
      {_drawPolygon(marketplaceData, navigation)}
    </MapView>
  );
};

export default MarketplaceMap;
