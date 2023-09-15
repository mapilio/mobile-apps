import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { View } from 'react-native';
import styles from './FeedList.styles';

const SkeletonList = () => (
  <SkeletonPlaceholder>
    {[...Array(6)].map((_v, i) => (
      <View style={styles.skeletonItem} key={i} />
    ))}
  </SkeletonPlaceholder>
);

export default SkeletonList;
