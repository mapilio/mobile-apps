import WebView from "react-native-webview";
import React, { Fragment } from "react";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";

const WebviewScreen = ({route}) => {
  const {url} = route.params

  return <Fragment>
    <FocusAwareStatusBar barStyle="dark-content" backgroundColor="white"/>
    <WebView source={{uri: url}} style={{ opacity: 0.99 }} />
  </Fragment>
}

export default WebviewScreen;
