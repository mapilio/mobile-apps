import MapboxGL from "@rnmapbox/maps";

const Userlocation = ({shape}) => {
  return (
    <MapboxGL.ShapeSource
    shape={shape}
    id={"userLocationSource"}
    >
      <MapboxGL.CircleLayer
        id={"MarkerViewCircle"}
        style={{
          circleColor: "#5383EC",
          circleStrokeWidth: 2,
          circleStrokeColor: "white",
          circleRadius: 10,
        }}
      />
      <MapboxGL.CircleLayer
        id={"userLocationCircle-opacity"}
        style={{
          circleColor: "#5383EC",
          circleRadius: 14,
          circleOpacity: 0.4,
          circleStrokeColor: "#5383EC",
        }}
      />
      <MapboxGL.SymbolLayer
        id={"userLocationArrow"}
        style={{
          iconImage: require("../../../assets/images/map/arrow.png"),
          iconSize: 0.5,
          iconAllowOverlap: true,
          iconOffset: [0, 2],
          iconRotate: ["get", "heading"],
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

export default Userlocation;
