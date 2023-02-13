import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { leaderStyles as styles } from "../../styles/leaderStyles";

const SkeletonLoading = () => {
  const Skeleton = () => {
    return (
      <SkeletonPlaceholder speed={2000}>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          paddingVertical={10}
          paddingHorizontal={10}
        >
          <SkeletonPlaceholder.Item
            style={styles.listItem.rank.rankers}
            width={RFValue(33)}
            height={RFValue(22)}
          />

          <SkeletonPlaceholder.Item
            width={42}
            height={42}
            borderRadius={42}
            marginLeft={10}
          />
          <SkeletonPlaceholder.Item
            width={"100%"}
            height={20}
            borderRadius={4}
            marginLeft={10}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {Array(15)
        .fill(0)
        .map((_, index) => {
          return <Skeleton key={index} />;
        })}
    </View>
  );
};

export default SkeletonLoading;
