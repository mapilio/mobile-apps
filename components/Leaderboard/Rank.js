import CrownIcon from "../../assets/svg/illustrations/CorwnIcon";
import { View, Text } from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";

const Rank = ({ rankIndex, isAuthUser }) => {

    const rankStyle = isAuthUser
    ? styles.authUserListItem.rank.text
    : styles.listItem.rank.text;


    switch (rankIndex) {
      case 0:
        return <CrownIcon />;
      case 1:
      case 2:
        return (
          <View style={styles.listItem.rank.rankers}>
            <Text style={styles.listItem.rank.rankers.text}>
              {rankIndex + 1}
            </Text>
          </View>
        );
      default:
        return (
          <Text style={rankStyle}>
            {"#"}
            {rankIndex + 1}
          </Text>
        );
    }
  };

  export default Rank;