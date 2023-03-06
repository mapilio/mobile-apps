import WebView from "react-native-webview";
import React, {Fragment, useState} from "react";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import {Loading} from "../components";

const WebviewScreen = ({route}) => {
  const [loading, setLoading] = useState(true);
  const {url} = route.params

  return <Fragment>
    <FocusAwareStatusBar barStyle="dark-content" translucent backgroundColor="#fff"/>
    <WebView
      source={{uri: url}}
      style={{opacity: 0.99}}
      onLoadEnd={() => setLoading(false)}
    />

    {
      loading && <Loading containerStyle={{
        position: "absolute",
        flex: 1,
        width: "100%",
        height: "100%",
        zIndex: 10,
      }}/>
    }
  </Fragment>
}

export default WebviewScreen;
