import { SafeAreaView, ActivityIndicator } from "react-native";

const Loading = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#130C47" />
    </SafeAreaView>
  );
};

export default Loading;
