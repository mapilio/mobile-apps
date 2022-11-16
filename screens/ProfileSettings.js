import {FlatList, Pressable, StyleSheet, Text, View} from "react-native";
import {CustomText} from "../highordercomponents";
import {Routes} from "../navigator/Routes";
import {RFValue} from "react-native-responsive-fontsize";
import {useDispatch} from "react-redux";
import {EXIT_USER} from "../store/actionsName";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const ListItem = ({name, onPress}) => {
  return (
    <Pressable style={styles.listItem} onPress={onPress}>
      <CustomText style={styles.listText}>{name}</CustomText>
    </Pressable>
  )
}

const ProfileSettings = ({navigation}) => {
  const {bottom} = useSafeAreaInsets();
  const dispatch = useDispatch();

  const lists = [
    {name: 'Licenses', url: 'https://mapilio.com/licenses-webview'},
    {name: 'Terms & Conditions', url: 'https://mapilio.com/terms-webview'},
    {name: 'Privacy Policy', url: 'https://mapilio.com/privacy-webview'},
    {name: 'About', url: 'https://mapilio.com/about-webview'}
  ]

  const handlePress = (url) => {
    navigation.navigate(Routes.webview, {url: url})
  }

  const exitHandle = () => {
    navigation.navigate(Routes.map);
    dispatch({type: EXIT_USER});
  }

  return (
    <View style={styles.wrapper}>
      <View>
        <FlatList
          scrollEnabled={false}
          data={lists}
          renderItem={({item: {name, url}}) => <ListItem name={name} onPress={() => handlePress(url)}/>}
        />

        <Pressable onPress={exitHandle}>
          <CustomText style={styles.signOut}>Sign out</CustomText>
        </Pressable>
      </View>

      <View style={{...styles.version, bottom: bottom + RFValue(10)}}>
        <Text style={styles.versionInfo}>mapilio</Text>
        <Text style={{...styles.versionInfo, fontWeight: "bold"}}> V 1.0.2</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    padding: RFValue(18),
    flex: 1,
    position: "relative",
    justifyContent: "flex-start"
  },
  listItem: {
    borderBottomWidth: 1,
    borderColor: "#EAEAEA",
    paddingVertical: RFValue(14),
  },
  listText: {
    color: '#666666',
    fontSize: RFValue(16)
  },
  signOut: {
    color: '#3F8BE9',
    fontSize: RFValue(14),
    paddingVertical: RFValue(14)
  },
  version: {
    flexDirection: "row",
    position: "absolute",
    right: RFValue(16)
  },
  versionInfo: {
    color: '#666666',
    fontSize: RFValue(14)
  },
})

export default ProfileSettings;
