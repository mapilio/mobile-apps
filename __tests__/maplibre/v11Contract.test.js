import fs from 'node:fs';
import path from 'node:path';
import { toMapLibrePaint } from '../../components/Map/mapLibreStyle';

const root = path.resolve(__dirname, '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const mapFiles = [
  'highordercomponents/MapView.js',
  'screens/AppMap.js',
  'components/Marketplace/MarketplaceMap.js',
  'screens/UserFeed/UserFeedDetails.js',
  'screens/UserSequence.js',
  'screens/CaptureCompleted.js',
  'screens/ProfileSequence.js',
  'screens/ProfileUploadDetail.js',
  'components/Map/layers/Lines.js',
  'components/Map/layers/ActiveSources.js',
  'components/Map/layers/Points.js',
];

describe('MapLibre v11 contract', () => {
  it('pins v11 and removes the v10 component surface', () => {
    const packageJson = JSON.parse(read('package.json'));
    expect(packageJson.dependencies['@maplibre/maplibre-react-native']).toBe('11.3.6');

    const source = mapFiles.map(read).join('\n');
    expect(source).toContain('GeoJSONSource');
    expect(source).toContain('Layer');
    expect(source).not.toMatch(
      /<MapLibre(?:GL)?\.(?:ShapeSource|LineLayer|CircleLayer|FillLayer)\b|setCamera\(|centerCoordinate\s*=|zoomLevel\s*=|animationDuration\s*=|tileUrlTemplates\s*=|sourceLayerID\s*=/
    );
  });

  it('uses the v11 wrapper, logging, and GPS contracts', () => {
    const wrapper = read('highordercomponents/MapView.js');
    const appMap = read('screens/AppMap.js');
    const source = mapFiles.map(read).join('\n');
    expect(source).not.toMatch(
      /import\s+\w+\s*(?:,\s*\{[^}]*\})?\s+from\s+['"]@maplibre\/maplibre-react-native['"]/
    );
    expect(wrapper).toContain('<MapLibreGL.Map');
    expect(wrapper).toContain('LogManager.setLogLevel');
    expect(wrapper).not.toMatch(/setAccessToken|Logger|MapLibreGL\.MapView/);
    expect(appMap).toContain('useCurrentPosition');
    expect(appMap).toContain('<MapLibreGL.UserLocation');
    expect(appMap).not.toContain('NativeUserLocation');
    expect(appMap).toContain('accuracy heading');
    expect(appMap).toContain('setStop');
    expect(appMap).toContain(
      'const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)'
    );
    expect(appMap).toContain('enabled: locationPermissionGranted && showLocation');
    expect(appMap).toContain('{locationPermissionGranted && showLocation && (');
    expect(appMap).not.toMatch(/renderMode|onUpdate|followUserLocation\s*\}/);

    const userSequence = read('screens/UserSequence.js');
    expect(userSequence).toContain('getGeoJsonBounds(line)');
    expect(userSequence).not.toMatch(/\bbbox\(line\)/);
  });

  it('keeps tile endpoints and converts layer styles to v11 paint keys', () => {
    const layers = read('components/Map/layers/Lines.js') + read('components/Map/layers/Points.js');
    const marketplace = read('components/Marketplace/MarketplaceMap.js');
    expect(layers).toContain('tiles={[tileConfig.roadUrl]}');
    expect(layers).toContain('tiles={[tileConfig.pointUrl]}');
    expect(layers).toContain('source-layer=');
    expect(layers).toContain('toMapLibrePaint');
    expect(marketplace).toContain("'fill-color'");
    expect(marketplace).toContain("'fill-outline-color'");
    expect(toMapLibrePaint({ circleColor: '#fff', circleRadius: 4 })).toEqual({
      'circle-color': '#fff',
      'circle-radius': 4,
    });
  });
});
