import { ActivityIndicator, Dimensions, Image, ScrollView, View } from 'react-native';
import React, { useState } from 'react';

const IsLoading = ({ height, status }) => {
  if (!status) {
    return;
  }

  return (
    <View
      style={{
        position: 'absolute',
        height: height,
        width: Dimensions.get('screen').width,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator color={'#000'} size={'large'} />
    </View>
  );
};

const Panorama = ({ image, height, resolution = '1920x1080' }) => {
  const [loading, setLoading] = useState(true);

  const parsedResolution = resolution.split('x');
  const resourceWidth = Math.max(parseInt(parsedResolution[0]), parseInt(parsedResolution[1]));
  const resourceHeight = Math.min(parseInt(parsedResolution[0]), parseInt(parsedResolution[1]));
  const imageWidth = resourceWidth / (resourceHeight / height);

  const onLoad = () => setLoading(false);

  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={{ height: height }}
      snapToAlignment={'center'}>
      <IsLoading height={height} status={loading} />
      <Image
        source={{ uri: image }}
        style={{ height: height, width: imageWidth, resizeMode: 'cover' }}
        onLoadEnd={onLoad}
        onLoadStart={() => setLoading(true)}
      />
    </ScrollView>
  );
};

export default Panorama;
