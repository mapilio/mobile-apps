import { SafeAreaView, ActivityIndicator } from "react-native";

const Loading = ({backgroundColor="#fff", indicatorColor="gray", containerStyle}) => {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", backgroundColor: backgroundColor, ...containerStyle}}
    >
      <ActivityIndicator size="large" color={indicatorColor} />
    </SafeAreaView>
  );
};

export default Loading;
