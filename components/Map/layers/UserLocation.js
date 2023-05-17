import MapLibre from "@maplibre/maplibre-react-native";

const Userlocations = () => {
  return (
    <MapLibre.UserLocation
      showsUserHeadingIndicator
      renderMode="native"
      animated
    />
  );
};

export default Userlocations;
