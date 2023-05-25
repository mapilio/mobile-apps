import {ActivityIndicator, Dimensions, Image, Platform, ScrollView, Text, View} from "react-native";
import React, {Fragment, useState} from "react";
import PanoramaView from "@lightbase/react-native-panorama-view";

const IsLoading = ({height, status}) => {

  if (!status) {
    return;
  }

  return (
    <View style={{
      position: "absolute",
      height: height,
      width: Dimensions.get("screen").width,
      zIndex: 1,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <ActivityIndicator color={'#000'} size={"large"}/>
    </View>
  )
}

const Panorama = ({image, height, resolution = '1920x1080'}) => {
  const [loading, setLoading] = useState(true);

  const parsedResolution = resolution.split('x')
  const resourceWidth = Math.max(parseInt(parsedResolution[0]), parseInt(parsedResolution[1]))
  const resourceHeight = Math.min(parseInt(parsedResolution[0]), parseInt(parsedResolution[1]))
  const imageWidth = resourceWidth / (resourceHeight / height)

  const onLoad = () => setLoading(false)

  const isIOS = Platform.OS === 'ios'
  const isPanoramic = resourceWidth % resourceHeight === 0

  if (isIOS && isPanoramic) {
    return (
      <Fragment>
        <IsLoading height={height} status={loading}/>
        <PanoramaView style={{height: height}} imageUrl={image} onImageLoaded={onLoad}/>
      </Fragment>
    )
  }

  return (
    <ScrollView horizontal={true} contentContainerStyle={{height: height}} snapToAlignment={"center"}>
      <IsLoading height={height} status={loading} />
      <Image
        source={{uri: image}}
        style={{height: height, width: imageWidth, resizeMode: "cover"}}
        onLoadEnd={onLoad}
      />
    </ScrollView>
  )
}

export default Panorama;
