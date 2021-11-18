import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./navigator/MainNavigator";
import { store } from "./store/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
