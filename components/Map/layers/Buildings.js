import MapLibreGL from "@maplibre/maplibre-react-native";

const Buildings = () => {
  return (
    <MapLibreGL.FillExtrusionLayer
      id="3d-buildings"
      sourceID="openmaptiles"
      sourceLayerID="building"
      minZoomLevel={15}
      style={{
        fillExtrusionColor: "#aaa",
        fillExtrusionHeight:  15,
        fillExtrusionBase:["get", "min_height"],
        fillExtrusionOpacity: 0.6,
      }}
    />
  );
};

export default Buildings;
