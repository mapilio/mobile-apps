import MapLibre from "@maplibre/maplibre-react-native";

const Userlocations = () => {
  return (
     <MapLibre.UserLocation showsUserHeadingIndicator renderMode="native" animated >
      {/* <MapLibre.CircleLayer
        id={"MarkerViewCircle"}
        style={{
          circleColor: "#191919",
          circleStrokeWidth: 1,
          circleStrokeColor: "white",
          circleRadius: 10, 
        }}
      />
      <MapLibre.CircleLayer
        id={"userLocationCircle-opacity"}
        style={{
          circleColor: "#191919",
          circleRadius: 14,
          circleOpacity: 0.4,
          circleStrokeColor: "#191919",
        }}
      />

      <MapLibre.SymbolLayer
        id={"userLocationArrow"}
        style={{
          iconImage: require("../../../assets/images/map/arrow.png"),
          iconSize: 0.5,
          iconAllowOverlap: true,
          iconOffset: [0, 2],
          iconRotate: ["get", "heading"],
        }}
      /> */}
      </MapLibre.UserLocation>
  );
};

export default Userlocations;
