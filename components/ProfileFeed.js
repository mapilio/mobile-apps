import React, {useState} from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {userFeedStyles} from "../styles/userProfileStyle";
import moment from "moment";
import Config from "react-native-config";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {RFValue} from "react-native-responsive-fontsize";
import {useTranslation} from "react-i18next";
import {Photos} from "../assets/svg/illustrations";
import LinearGradient from "react-native-linear-gradient";

const SkeletonItem = ({loading}) => {
  if(!loading) return false;

  return (
    <SkeletonPlaceholder speed={1000}>
      <SkeletonPlaceholder.Item height={RFValue(100)} />
    </SkeletonPlaceholder>
  )
}

const ProfileFeed = ({data, pressHandle}) => {
  const {t} = useTranslation("profile");
  const [imageLoading, setImageLoading] = useState(true);
  const {capture_time, total, last_status, uploaded_hash, cover_photo, start_address} = data;

  return (
    <TouchableOpacity style={userFeedStyles.wrapper} onPress={pressHandle}>
      <View style={userFeedStyles.imageWrapper}>

        <SkeletonItem loading={imageLoading}/>

        <LinearGradient
          colors={['#00000000', '#000000BF']}
          angle={90}
          useAngle={true}
          style={userFeedStyles.imageGradient}
        />

        <Image
          style={userFeedStyles.imageStyle}
          source={{uri: `${Config.IMAGE_API}/${uploaded_hash}/${cover_photo}/480`}}
          onLoadEnd={() => setImageLoading(false)}
        />
      </View>

      <View style={userFeedStyles.status}>
        <Text style={{...userFeedStyles.status.text, ...userFeedStyles.status[last_status || "fail"]}}>
          {t(last_status || "fail")} {" "}
          <View
            style={{
              ...userFeedStyles.status.icon.border,
              ...userFeedStyles.status.icon[last_status || "fail"]["border"]
            }}
          >
            <View style={{...userFeedStyles.status.icon, ...userFeedStyles.status.icon[last_status || "fail"]}}/>
          </View>
        </Text>
      </View>

      <View style={userFeedStyles.info}>
        <Text style={userFeedStyles.address} numberOfLines={1}>
          {start_address || t("no_address")}
        </Text>

        <View style={userFeedStyles.subInfo}>
          <Text style={userFeedStyles.date}>{moment(capture_time).format("DD-MM-YYYY")}</Text>
          <Text style={userFeedStyles.date}>{total} <Photos/></Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileFeed;
