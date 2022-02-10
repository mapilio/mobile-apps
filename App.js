import React, { useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./navigator/MainNavigator";
import { AppState, StatusBar, Dimensions } from "react-native";
import { persistor, store } from "./store/store";
import { Provider } from "react-redux";
import { permissionHandler, useFonts } from "./helper/helper";
import { PersistGate } from "redux-persist/integration/react";
import { NotifierWrapper } from "react-native-notifier";

function App() {
  const [isReady, setIsReady] = useState(false);

  const loadFonts = async () => {
    await useFonts();
  };

  useEffect(() => {
    if (isReady) {
      StatusBar.setBarStyle("light-content", true);
    }
  }, [isReady]);

  const setReady = async () => {
    await permissionHandler();
    openApp();
  };

  const openApp = () => setIsReady(true);

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={setReady}
        onError={(error) => console.error(error)}
      />
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <NotifierWrapper>
              <MainNavigator />
          </NotifierWrapper>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
