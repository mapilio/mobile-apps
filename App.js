import React, { useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./navigator/MainNavigator";
import { StatusBar } from "react-native";
import { persistor, store } from "./store/store";
import { Provider } from "react-redux";
import { useFonts } from "./helper/helper";
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

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setIsReady(true)}
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
