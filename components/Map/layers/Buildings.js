import MapLibreGL from "@maplibre/maplibre-react-native";

const Buildings = () => {
  return (
    <MapLibreGL.FillExtrusionLayer
      id="3d-buildings"
      sourceID='maptiler-source'
      sourceLayerID="building"
      filter={['==', 'extrude', 'true']}
      minZoomLevel={15}
      style={{
        fillExtrusionColor: "#aaa",
        fillExtrusionHeight: ["get", "height"],
        fillExtrusionBase: ["get", "min_height"],
        fillExtrusionOpacity: 0.6,
      }}
    />
  );
};

export default Buildings;
