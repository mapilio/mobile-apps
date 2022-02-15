import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { globalStyles } from "../styles/globalStyles";
import { FeedImageCard } from "./index";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import { userSequenceStyles } from "../styles/userSequenceStyle";
import { IMAGE_API } from "@env";

const ListProfileUploads = ({
  navigation,
  sequence_uuid,
  user_id,
  imageList,
  setImagesList,
  loading,
}) => {
  useEffect(() => {
    let unsubscribe = navigation.addListener("blur", () => {
      setImagesList([]);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <View style={{ marginTop: RFValue(25) }}>
        <CustomTextMedium style={globalStyles.screenTitle}>
          Images you uploaded
        </CustomTextMedium>
        <CustomText style={globalStyles.screenDescription}>
          Here you can uploaded pictures.
        </CustomText>
      </View>
      <View
        style={[
          userSequenceStyles.sequenceWrapper,
          globalStyles.screenTextMargin,
        ]}
      >
        {loading
          ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
              <View
                style={{
                  maxWidth: "31%",
                  marginRight: RFValue(5),
                  justifyContent: "space-between",
                }}
                key={i}
              >
                <SkeletonPlaceholder>
                  <View
                    style={{
                      width: RFValue(100),
                      height: RFValue(78),
                      borderRadius: 8,
                      marginRight: RFValue(5),
                      marginBottom: RFValue(5),
                    }}
                  />
                </SkeletonPlaceholder>
              </View>
            ))
          : imageList.map((image) => (
              <FeedImageCard
                key={image.id}
                path={`${IMAGE_API}/${image.img_code}/${image.filename}`}
                id={image.id}
                navigation={navigation}
                sequenceUUID={sequence_uuid}
                userID={user_id}
                imageList={imageList}
              />
            ))}
      </View>
    </View>
  );
};

export default ListProfileUploads;
