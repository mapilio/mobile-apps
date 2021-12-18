import React, {useState} from "react";
import {ActivityIndicator, Image, Platform, View} from "react-native";
import {CustomText, CustomTextBold, CustomTextMedium,} from "../highordercomponents";
import {userInfoStyles} from "../styles/userProfileStyle";

const UserInfos = () => {
    const [avatarLoading, setAvatarLoading] = useState(true);
    const [avatarError, setAvatarError] = useState(false);
    const showImage = avatarError
        ? require("../assets/images/default_avatar.png")
        : {
            uri: "http://images.unsplash.com/photo-15048767791-00dcc994a43e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
        };

    const infoGenerate = (value, subtitle) => {
        return (
            <View style={userInfoStyles.infoContainer}>
                <CustomTextBold style={userInfoStyles.infoValue}>
                    {value}
                </CustomTextBold>
                <CustomTextMedium style={userInfoStyles.infoTitle}>
                    {subtitle}
                </CustomTextMedium>
            </View>
        );
    };

    const finishLoad = () => {
        setAvatarLoading(false);
    };

    const setError = () => {
        setAvatarError(true);
    };

    const loadIOS = () => {
        if (Platform.OS === "ios") {
            setAvatarLoading(false)
        }
    }

    return (
        <View style={userInfoStyles.profileContainer}>
            <Image
                style={{
                    ...userInfoStyles.imageStyle,
                    display: Platform.OS === "android" && avatarLoading ? "none" : "flex",
                }}
                source={showImage}
                onLoadEnd={finishLoad}
                onError={setError}
            />
            {avatarLoading &&
                <ActivityIndicator
                    color={"#AFAFAF"}
                    style={userInfoStyles.indicatorStyle}
                />
            }
            <View style={userInfoStyles.infoContainer}>
                <View>
                    <CustomTextMedium style={userInfoStyles.username}>
                        John Doe
                    </CustomTextMedium>
                    <CustomText style={userInfoStyles.accountType}>
                        Individual Account
                    </CustomText>
                </View>
                <View style={userInfoStyles.infoGrid}>
                    {infoGenerate(43, "sequences")}
                    {infoGenerate(230, "photos")}
                    {infoGenerate(1366, "meters")}
                </View>
            </View>
        </View>
    );
};

export default UserInfos;
