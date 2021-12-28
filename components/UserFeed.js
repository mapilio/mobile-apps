import React, {useState} from "react";
import {Image, TouchableOpacity, View} from "react-native";
import {CustomText, CustomTextBold} from "../highordercomponents";
import {Routes} from "../navigator/Routes";
import {userFeedStyles} from "../styles/userProfileStyle";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {RFValue} from "react-native-responsive-fontsize";
import {useDispatch} from "react-redux";
import {ACTIVE_SEQUENCE, UPDATE_SELECTED_IMAGES} from "../store/actionsName";

const UserFeed = ({navigation, data}) => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    return (
        loading ?
            <SkeletonPlaceholder>
                <View style={{width: "100%", height: RFValue(95),marginBottom:RFValue(5)}}/>
            </SkeletonPlaceholder>
            :
            <TouchableOpacity
                activeOpacity={0.7}
                style={userFeedStyles.feedContainer}
                onPress={() => {
                  dispatch({type: ACTIVE_SEQUENCE, payload: data.sequence_uuid});
                  dispatch({type: UPDATE_SELECTED_IMAGES, payload: []});
                  navigation.navigate(Routes.sequences, {id: data.sequence_uuid})
                }}
            >
                <View style={userFeedStyles.viewStyle}>
                    <CustomTextBold style={userFeedStyles.dateStyle}>
                      {data.exif && JSON.parse(data.exif).DateTime}
                    </CustomTextBold>
                  <CustomText style={userFeedStyles.descriptionStyle}>
                    {data.count} images
                  </CustomText>
                </View>
                <View>
                  <Image
                    style={userFeedStyles.imageStyle}
                    source={{uri: `${data.path}`}}
                  />
                </View>
            </TouchableOpacity>
    );
};

export default UserFeed;
