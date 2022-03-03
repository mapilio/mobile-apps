import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { sequenceCardStyles } from "../styles/userSequenceStyle";
import { Routes } from "../navigator/Routes";
import { RFValue } from "react-native-responsive-fontsize";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const FeedImageCard = (props) => {
  const [imageLoad, setImageLoad] = useState(true);
  const image = {
    uri: `${props.path}/240`,
  };

  const loadEnd = () => setImageLoad(true);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={sequenceCardStyles.cardContainer}
      onPress={() => {
        props.navigation.navigate(Routes.feedDetail, {
          id: props.id,
          sequence_uuid: props.sequenceUUID,
          user_id: props.userID,
          path: `${props.path}/1080`,
          points: props.imageMapList,
          heading: props.heading,
          base: true,
          coordinate: [
            Number(props.coordinate[0]),
            Number(props.coordinate[1]),
          ],
        });
      }}
    >
      <View style={sequenceCardStyles.imagePosition}>
        {imageLoad && (
          <SkeletonPlaceholder>
            <View
              style={{
                width: RFValue(100),
                height: RFValue(78),
                borderRadius: 8,
                marginRight: RFValue(5),
                marginBottom: RFValue(5),
                zIndex: 99,
                position: "absolute",
              }}
            />
          </SkeletonPlaceholder>
        )}
        <Image
          style={{
            height: RFValue(78),
            borderRadius: 8,
            maxWidth: "100%",
            width: 120,
            resizeMode: "cover",
          }}
          source={image}
          onLoadEnd={loadEnd}
        />
      </View>
    </TouchableOpacity>
  );
};

export default FeedImageCard;
