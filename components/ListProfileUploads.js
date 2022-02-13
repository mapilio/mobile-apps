import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { globalStyles } from "../styles/globalStyles";
import { FeedImageCard } from "./index";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import { userSequenceStyles } from "../styles/userSequenceStyle";
import { fetchHandler } from "../helper/helper";
import { SERVICE_URL, IMAGE_API } from "@env";
import { UPDATE_CURRENT_FEED_SEQUENCE } from "../store/actionsName";
import { useDispatch } from "react-redux";

const ListProfileUploads = ({ navigation, sequence_uuid, user_id }) => {
  const [imageList, setImagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", () => {
      dispatch({
        type: UPDATE_CURRENT_FEED_SEQUENCE,
        payload: {
          sequenceUUID: sequence_uuid,
          userID: user_id,
        },
      });
      fetchHandler({
        url: `${SERVICE_URL}/api/user-uploads-detail?user_id=${user_id}&sequence_uuid=${sequence_uuid}`,
      })
        .then((res) => {
          setImagesList(res.data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    });
    return unsubscribe;
  }, [navigation, sequence_uuid]);

  useEffect(() => {
    let unsubscribe = navigation.addListener("blur", () => {
      setImagesList([]);
    });
    return unsubscribe;
  }, [navigation]);

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
                path={`${IMAGE_API}/${image.img_code}/${image.filename}`}
                id={image.id}
                navigation={navigation}
                sequenceUUID={sequence_uuid}
                userID={user_id}
              />
            ))}
      </View>
    </View>
  );
};

export default ListProfileUploads;
