import React, { useState } from "react";
import { Image, View, ActivityIndicator } from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";

const UserProfileImage = ({ source, spinnerColor = "gray" }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.profilePhoto}>
      <Image
        source={{
          uri: source,
          width: 42,
          height: 42,
          cache: "default",
        }}
        style={[{ borderRadius: 50 }, isLoading && { opacity: 0 }]}
        onLoadEnd={() => setIsLoading(false)}
      />
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={spinnerColor}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
      )}
    </View>
  );
};

export default UserProfileImage;
