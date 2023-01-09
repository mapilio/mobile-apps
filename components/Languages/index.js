import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Flags} from "../../assets/svg/illustrations";
import {RFValue} from "react-native-responsive-fontsize";
import i18next from "i18next";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {UPDATE_LANGUAGE} from "../../store/actionsName";

const languages = ['tr', 'en', 'ch', 'fr', 'de', 'it', 'pr', 'es'];

const Language = () => {
  const {language} = useSelector((state) => state.generalReducer);
  const {t} = useTranslation("languages")
  const dispatch = useDispatch();

  const handleChange = (code) => {
    i18next.changeLanguage(code)
    dispatch({type: UPDATE_LANGUAGE, payload: code})
  }

  return (
    <View style={{paddingHorizontal: RFValue(15)}}>
      <FlatList keyExtractor={(item) => item} data={languages} renderItem={({item}) => (
        <TouchableOpacity onPress={() => handleChange(item)} style={styles.wrapper}>
          <Flags flag={item}/>
          <Text style={{...styles.languageText, color: item === language ? "#000" : "#D8D8D8"}}>
            {t(item)}
          </Text>
          {item === language && <View style={styles.checkIcon}/>}
        </TouchableOpacity>
      )}/>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: RFValue(15),
    borderBottomWidth: 1,
    borderBottomColor: '#F4F2F6'
  },
  languageText: {
    fontSize: RFValue(16),
    textTransform: "capitalize",
    paddingLeft: 5
  },
  checkIcon: {
    width: RFValue(8),
    height: RFValue(15),
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomWidth: RFValue(1.5),
    borderLeftWidth: RFValue(1.5),
    borderColor: "#3F8BE9",
    transform: [{rotate: "45deg"}, {scaleX: -1}],
    position: "absolute",
    right: RFValue(10),
  }
})

export default Language;
