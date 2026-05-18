import SkeletonPlaceholder from '../Skeleton';
import { View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { leaderStyles as styles } from '../../styles/leaderStyles';

const SkeletonLoading = () => {
  const Skeleton = () => {
    return (
      <SkeletonPlaceholder speed={2000}>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          paddingVertical={10}
          paddingHorizontal={10}>
          <SkeletonPlaceholder.Item
            style={styles.listItem.rank.rankers}
            width={RFValue(25)}
            height={RFValue(25)}
          />

          <SkeletonPlaceholder.Item width={42} height={42} borderRadius={42} marginLeft={10} />
          <SkeletonPlaceholder.Item width={'100%'} height={20} borderRadius={4} marginLeft={10} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: RFValue(10) }}>
      {Array(15)
        .fill(0)
        .map((_, index) => {
          return <Skeleton key={index} />;
        })}
    </View>
  );
};

export default SkeletonLoading;
