import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Flags} from "../../assets/svg/illustrations";
import {RFValue} from "react-native-responsive-fontsize";
import i18next from "i18next";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {UPDATE_LANGUAGE} from "../../store/actionsName";
import { CheckIcon } from "../../assets/svg/illustrations";

const languages = ["tr", "en", "ch", "fr", "de", "it", "pr", "es"];

const Language = () => {
  const { language } = useSelector((state) => state.generalReducer);
  const { t } = useTranslation("languages");
  const dispatch = useDispatch();

  const handleChange = (code) => {
    i18next.changeLanguage(code);
    dispatch({ type: UPDATE_LANGUAGE, payload: code });
  };

  return (
    <View style={{ paddingHorizontal: RFValue(15) }}>
      <FlatList
        keyExtractor={(item) => item}
        data={languages}
        renderItem={({ item }) => {
          const isActive = item === language;
          return (
            <TouchableOpacity
              onPress={() => handleChange(item)}
              style={styles.wrapper}
            >
              <Flags flag={item} />
              <Text
                style={[
                  { ...styles.languageText },
                  isActive
                    ? {
                        color: "#000",
                        fontFamily: "Poppins-Medium",
                      }
                    : {
                        color: "#666666",
                        fontFamily: "Poppins",
                      },
                ]}
              >
                {t(item)}
              </Text>
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: isActive ? "#3F8BE9" : "white",
                    borderWidth: isActive ? 0 : 2,
                  },
                ]}
              >
                <CheckIcon />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: RFValue(15),
    borderBottomWidth: 1,
    borderBottomColor: "#F4F2F6",
  },
  languageText: {
    fontSize: RFValue(14),
    textTransform: "capitalize",
    paddingLeft: 5,
  },
  checkbox: {
    width: RFValue(26),
    height: RFValue(26),
    borderRadius: RFValue(26),
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#F4F2F6",
    position: "absolute",
    right: RFValue(10),
  },
});

export default Language;
