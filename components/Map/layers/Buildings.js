import MapboxGL from "@rnmapbox/maps";

const Buildings = () => {
  return (
    <MapboxGL.FillExtrusionLayer
      id="add-3d-buildings"
      sourceID="composite"
      sourceLayerID="building"
      filter={["==", "extrude", "true"]}
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
