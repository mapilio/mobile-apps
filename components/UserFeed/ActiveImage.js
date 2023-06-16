import { View, Text, StyleSheet, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Config from "react-native-config";

const ActiveImage = ({ imgCode, filename }) => {
  const uri = `${Config.IMAGE_API}/${imgCode}/${filename}/1080`;

  return (
    <View style={styles.imageWrapper}>
      <Image
        source={{uri}}
        style={styles.activeImage}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 3,
    backgroundColor: "#fff",
  },
  activeImage: {
    height: "100%",
    width: "auto",
    borderTopLeftRadius: RFValue(10),
    borderTopRightRadius: RFValue(10),
  },
});

export default ActiveImage;
