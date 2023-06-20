import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import Config from "react-native-config";
import { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const ListImage = ({ onPress, item }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        if(isLoaded) onPress(item);
      }}
    >
      {!isLoaded && (
        <View
          style={styles.placeholder}
        >
          <SkeletonPlaceholder speed={2000}>
            <SkeletonPlaceholder.Item
              width={"100%"}
              height={"100%"}
              borderRadius={RFValue(5)}
            />
          </SkeletonPlaceholder>
        </View>
      )}
      <Image
        source={{
          uri: `${Config.IMAGE_API}/${item.img_code}/${item.filename}`,
        }}
        style={styles.listImage}
        resizeMode="cover"
        onLoadEnd={() => {
          setIsLoaded(true);
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    height: RFValue(75),
    margin: RFValue(2),
  },
  listImage: {
    height: "100%",
    width: "auto",
    borderRadius: RFValue(5),
  },
  placeholder:{
    position: "absolute",
    ...StyleSheet.absoluteFill,
    backgroundColor: "white",
    zIndex: 1,

  }
});
export default ListImage;
