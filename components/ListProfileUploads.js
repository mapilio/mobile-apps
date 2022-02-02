import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { globalStyles } from "../styles/globalStyles";
import { FeedImageCard } from "./index";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import { userSequenceStyles } from "../styles/userSequenceStyle";
import { fetchHandler } from "../helper/helper";

const ListProfileUploads = ({ navigation, sequence_uuid, user_id }) => {
  const [imageList, setImagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = `${process.env.API_URL}/api/user-uploads-detail?user_id=${user_id}&sequence_uuid=${sequence_uuid}`

  useEffect(() => {
    fetchHandler({
      url: url,
    })
      .then((res) => {
        setImagesList(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [sequence_uuid]);

  return (
    <View style={globalStyles.container}>
      <CustomTextMedium style={globalStyles.screenTitle}>
        Images you uploaded
      </CustomTextMedium>
      <CustomText style={globalStyles.screenDescription}>
        Here you can uploaded pictures.
      </CustomText>
      <View
        style={[
          userSequenceStyles.sequenceWrapper,
          globalStyles.screenTextMargin,
        ]}
      >
        {loading
          ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
              <View
                style={{ maxWidth: "31%", justifyContent: "space-between" }}
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
                path={`https://cdn.mapilio.com/im/${image.img_code}/${image.filename}/100`}
                id={image.id}
                navigation={navigation}
              />
            ))}
      </View>
    </View>
  );
};

export default ListProfileUploads;
