import React, { useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./navigator/MainNavigator";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { useFonts } from "./helper/helper";
import { StatusBar } from "react-native";

function App() {
  const [isReady, setIsReady] = useState(false);

  const loadFonts = async () => {
    await useFonts();
  };

  useEffect(() => {
    StatusBar.setBarStyle("light-content", true);
  }, []);

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
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
