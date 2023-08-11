import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const LeaderboardTabBar = ({ state, descriptors, navigation, position }) => {
  return (
    <View style={styles.wrapper}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: false });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const opacity = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [0, 1, 0],
        });

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              marginLeft: index == 0 ? 0 : 10,
              ...styles.tabBarButton,
            }}
          >
            <Animated.View
              style={{
                opacity,
                marginLeft: index == 0 ? 0 : 10,
                ...styles.tabBarButtonAbsolute,
              }}
            />
            <Animated.Text
              style={{
                opacity,
                ...styles.tabBarTextAbsolute,
              }}
            >
              {label}
            </Animated.Text>
            <Text style={styles.tabBarText}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingBottom: RFValue(5),
    paddingVertical: RFValue(10),
  },
  tabBarButton: {
    width: "30%",
    backgroundColor: "#F9F9F9",
    height: RFValue(30),
    borderRadius: RFValue(20),
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarText: {
    color: "#C2C2C2",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    zIndex: 3,
  },
  tabBarTextAbsolute: {
    position: "absolute",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    zIndex: 4,
    color: "white",
  },
  tabBarButtonAbsolute: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#0056F1",
    height: RFValue(30),
    borderRadius: RFValue(20),
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
});
export default LeaderboardTabBar;
