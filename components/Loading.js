import { SafeAreaView, ActivityIndicator } from "react-native";

const Loading = ({backgroundColor="#fff", indicatorColor="#130C47"}) => {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", backgroundColor: backgroundColor}}
    >
      <ActivityIndicator size="large" color={indicatorColor} />
    </SafeAreaView>
  );
};

export default Loading;
