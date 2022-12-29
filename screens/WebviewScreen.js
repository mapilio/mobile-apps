import WebView from "react-native-webview";
import React from "react";

const WebviewScreen = ({route}) => {
  const {url} = route.params

  return <WebView source={{uri: url}} style={{ opacity: 0.99 }} />
}

export default WebviewScreen;
