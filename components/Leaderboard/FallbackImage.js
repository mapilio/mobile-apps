import { View, Text } from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";

const FallbackImage = ({ displayName }) => {
  return (
    <View style={styles.fallbackImage}>
      <Text style={styles.fallbackImage.text}>
        {displayName ? displayName.charAt(0).toUpperCase() : ""}
      </Text>
    </View>
  );
};

export default FallbackImage;
