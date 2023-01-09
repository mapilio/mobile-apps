import React, {useEffect} from "react";
import {View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {globalStyles} from "../styles/globalStyles";
import {FeedImageCard} from "./index";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {CustomText, CustomTextMedium} from "../highordercomponents";
import {userSequenceStyles} from "../styles/userSequenceStyle";
import {ActivityIndicator} from "react-native-paper";
import {useDispatch} from "react-redux";
import {UPDATE_CURRENT_SEQUENCE} from "../store/actionsName";
import Config from "react-native-config";
import {useTranslation} from "react-i18next";

const ListProfileUploads = ({
  navigation,
  sequence_uuid,
  user_id,
  imageList,
  imageMapList,
  setImagesList,
  loading,
  paginationLoading,
}) => {
  const {t} = useTranslation("profile");
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe = navigation.addListener("blur", () => {
      setImagesList([]);
      dispatch({type: UPDATE_CURRENT_SEQUENCE, payload: null});
    });
    return () => unsubscribe();
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <View style={{ marginTop: RFValue(25) }}>
        <CustomTextMedium style={globalStyles.screenTitle}>
          {t("uploaded_title")}
        </CustomTextMedium>
        <CustomText style={globalStyles.screenDescription}>
          {t("uploaded_subtitle")}
        </CustomText>
      </View>
      <View
        style={[
          {
            ...userSequenceStyles.sequenceWrapper,
            ...globalStyles.screenTextMargin,
            justifyContent: "center",
          },
        ]}
      >
        {loading
          ? [...Array(16)].map((value, index) => (
              <View
                style={{
                  maxWidth: "31%",
                  marginRight: RFValue(5),
                  justifyContent: "space-between",
                }}
                key={index}
              >
                <SkeletonPlaceholder speed={1000}>
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
                path={`${Config.IMAGE_API}/${image.img_code}/${image.filename}`}
                id={image.id}
                navigation={navigation}
                sequenceUUID={sequence_uuid}
                heading={image.heading}
                userID={user_id}
                imageList={imageList}
                imageMapList={imageMapList}
                coordinate={[image.longitude, image.latitude]}
              />
            ))}
        {paginationLoading && (
          <ActivityIndicator
            style={{
              alignSelf: "center",
              textAlign: "center",
              marginHorizontal: RFValue(50),
              minWidth: "100%",
            }}
            color={"#130C47"}
          />
        )}
      </View>
    </View>
  );
};

export default ListProfileUploads;
