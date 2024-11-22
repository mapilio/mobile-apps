import {FlatList, Pressable, StyleSheet, Text, View} from "react-native";
import {CustomText} from "../highordercomponents";
import {Routes} from "../navigator/Routes";
import {RFValue} from "react-native-responsive-fontsize";
import {useDispatch, useSelector} from "react-redux";
import {EXIT_USER, SET_DEBUG_MODE} from "../store/actionsName";
import { OneSignal } from "react-native-onesignal";
import {useEffect} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useTranslation} from "react-i18next";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
// import { LoginManager, Profile } from "react-native-fbsdk-next";
import * as Application from "expo-application";

const ListItem = ({name, onPress}) => {
  const {t} = useTranslation('profile_settings');

  return (
    <Pressable style={styles.listItem} onPress={onPress}>
      <CustomText style={styles.listText}>{t(name)}</CustomText>
    </Pressable>
  )
}

const ProfileSettings = ({navigation}) => {
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();
  const {t} = useTranslation('profile_settings');
  const {debugMode} = useSelector((status) => status.generalReducer);
  const {credential,userInformation} = useSelector((status) => status.getTokenReducer);

  useEffect(() => {
    navigation.getParent().setOptions({tabBarStyle: {display: "none"}})
    return () => navigation.getParent().setOptions({tabBarStyle: {display: "flex", height: RFValue(63) + bottom}})
  }, []);

  const setDebugMode = () => {
    if(debugMode){
      dispatch({type: SET_DEBUG_MODE, payload: false})
      toast.show("Debug mode disabled", {type: "error"})
    }else{
      dispatch({type: SET_DEBUG_MODE, payload: true})
      toast.show("Debug mode enabled", {type: "success"})
      
    }
  }

  const lists = [
    {name: 'licences', url: 'https://mapilio.com/licenses-webview'},
    {name: 'terms_and_conditions', url: 'https://mapilio.com/terms-webview'},
    {name: 'privacy', url: 'https://mapilio.com/privacy-webview'},
    {name: 'about', url: 'https://mapilio.com/about-webview'}
  ]

  const handlePress = (url) => {
    navigation.navigate(Routes.webview, {url: url})
  }

  const exitHandle = () => {
    navigation.navigate(Routes.tabNavigator, {screen: Routes.map});
    if(credential?.type === "facebook"){
      // Profile.getCurrentProfile().then((currentProfile) => {
      //   if(currentProfile){
      //     LoginManager.logOut();
        // }
       // });
     }
    dispatch({type: EXIT_USER});
    OneSignal.User.removeEmail(userInformation.email);
  }

  return (
    <View style={styles.wrapper}>
      <FocusAwareStatusBar barStyle="dark-content" translucent backgroundColor="#fff"/>
      <View>
        <Pressable style={styles.listItem} onPress={() => navigation.navigate(Routes.profileEdit)}>
          <CustomText style={styles.listText}>{t("profile_edit")}</CustomText>
        </Pressable>

        <FlatList
          scrollEnabled={false}
          data={lists}
          renderItem={({item: {name, url}}) => <ListItem name={name} onPress={() => handlePress(url)}/>}
        />

       {/*  <Pressable style={styles.listItem} onPress={() => navigation.navigate(Routes.webview, {url: 'https://mapilio.com/rules-of-contest-webview'})}>
          <CustomText style={styles.listText}>{t("contest_rules")}</CustomText>
        </Pressable> */}

        <Pressable style={styles.listItem} onPress={() => navigation.navigate(Routes.language)}>
          <CustomText style={styles.listText}>{t("change_language")}</CustomText>
        </Pressable>

        <Pressable style={styles.listItem} onPress={() => navigation.navigate(Routes.deleteAccount)}>
          <CustomText style={styles.listText}>{t("delete_account")}</CustomText>
        </Pressable>

        <Pressable onPress={exitHandle}>
          <CustomText style={styles.signOut}>{t("sign_out")}</CustomText>
        </Pressable>
      </View>

      <Pressable style={{...styles.version, bottom: RFValue(20)}} onLongPress={setDebugMode}>
        <Text style={styles.versionInfo}>{t("mapilio")}</Text>
        <Text style={{...styles.versionInfo, fontWeight: "bold"}}> {Application.nativeApplicationVersion}</Text>
      </Pressable>
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
    color: '#808080',
    fontSize: RFValue(16),
  },
  appSettingsText:{
    color: 'black',
    fontSize: RFValue(16),
  },
  signOut: {
    color: '#0056F1',
    fontSize: RFValue(14),
    paddingVertical: RFValue(14),
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
