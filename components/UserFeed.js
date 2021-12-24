import React, {useState} from "react";
import {Image, TouchableOpacity, View} from "react-native";
import {CustomText, CustomTextBold} from "../highordercomponents";
import {Routes} from "../navigator/Routes";
import {userFeedStyles} from "../styles/userProfileStyle";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {RFValue} from "react-native-responsive-fontsize";

const UserFeed = ({navigation, data}) => {
    const [loading, setLoading] = useState(true)
    return (
        !loading ?
            <SkeletonPlaceholder>
                <View style={{width: "100%", height: RFValue(95),marginBottom:RFValue(5)}}/>
            </SkeletonPlaceholder>
            :
            <TouchableOpacity
                activeOpacity={0.7}
                style={userFeedStyles.feedContainer}
                onPress={() => navigation.navigate(Routes.sequences)}
            >
                <View style={userFeedStyles.viewStyle}>
                    <CustomTextBold style={userFeedStyles.dateStyle}>
                        Aug 14, 2020 - 15:00
                    </CustomTextBold>
                    <CustomText style={userFeedStyles.descriptionStyle}>
                        {data.text}
                    </CustomText>
                </View>
                <View>
                    <Image
                        source={require("../assets/images/car.png")}
                        style={userFeedStyles.imageStyle}
                    />
                </View>
            </TouchableOpacity>
    );
};

export default UserFeed;
