import WebView from "react-native-webview";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../../navigator/Routes";

const Award = () => {
  const {config:{challengeURL}} = useSelector((state) => state.generalReducer);
  const navigation = useNavigation();
  
  const injectedJavaScript = `(function() {
    window.postMessage = function(data) {
      window.ReactNativeWebView.postMessage(data);
    };
  })();`;

  return (
    <WebView
      source={{
        uri: challengeURL,
      }}
      onMessage={(event) => {
        const message = event.nativeEvent.data;

        if (message === "openCamera") {
          navigation.navigate(Routes.cameraTab)
        }
      }}
      startInLoadingState={true}
      injectedJavaScript={injectedJavaScript}
    />
  );
};

export default Award;
