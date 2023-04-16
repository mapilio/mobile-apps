import {ShapeSource, CircleLayer, Images, SymbolLayer} from "@rnmapbox/maps";

const Userlocation = ({ shape }) => {
  return (
    <ShapeSource shape={shape} id={"userLocationSource"}>
      <CircleLayer
        id={"MarkerViewCircle"}
        style={{
          circleColor: "#191919",
          circleStrokeWidth: 1,
          circleStrokeColor: "white",
          circleRadius: 10,
        }}
      />
      <CircleLayer
        id={"userLocationCircle-opacity"}
        style={{
          circleColor: "#191919",
          circleRadius: 14,
          circleOpacity: 0.4,
          circleStrokeColor: "#191919",
        }}
      />
      <Images
        images={{ arrow: require("../../../assets/images/map/arrow.png") }}
      />
      <SymbolLayer
        id={"userLocationArrow"}
        style={{
          iconImage: "arrow",
          iconSize: 0.5,
          iconAllowOverlap: true,
          iconOffset: [0, 2],
          iconRotate: ["get", "heading"],
        }}
      />
    </ShapeSource>
  );
};

export default Userlocation;
