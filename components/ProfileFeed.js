import React from "react";
import {Image, TouchableOpacity, View} from "react-native";
import {CustomText, CustomTextBold} from "../highordercomponents";
import {Routes} from "../navigator/Routes";
import {userFeedStyles} from "../styles/userProfileStyle";
import moment from "moment";

const ProfileFeed = ({navigation, data}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={userFeedStyles.feedContainer}
            onPress={() => {
                navigation.navigate(Routes.sequences, {id: 1})
            }}
        >
            <View style={userFeedStyles.viewStyle}>
                <CustomTextBold style={userFeedStyles.dateStyle}>
                    {moment(data.created_at).format("DD-MM-YYYY")}
                </CustomTextBold>
                <CustomText style={userFeedStyles.descriptionStyle}>
                    {data.total_images} images
                </CustomText>
            </View>
            <View>
                <Image
                    style={userFeedStyles.imageStyle}
                    source={require("../assets/images/car.png")}
                />
            </View>
        </TouchableOpacity>
    );
};

export default ProfileFeed;
