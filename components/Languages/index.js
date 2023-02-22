import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Flags } from "../../assets/svg/illustrations";
import { RFValue } from "react-native-responsive-fontsize";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_LANGUAGE } from "../../store/actionsName";
import { CheckIcon } from "../../assets/svg/illustrations";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

const Language = ({ onPress, isBottomSheet = false }) => {
  const { language } = useSelector((state) => state.generalReducer);
  const { t } = useTranslation("languages");
  const dispatch = useDispatch();

  const languages = ["tr", "en"];
  const handleChange = (code) => {
    i18next.changeLanguage(code);
    dispatch({ type: UPDATE_LANGUAGE, payload: code });
    if (onPress) {
      onPress();
    }
  };

  const renderItem = ({ item }) => {
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
  };

  if (isBottomSheet) {
    return (
      <BottomSheetFlatList
        style={{ paddingHorizontal: RFValue(15) }}
        data={languages}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
    );
  }

  return (
    <FlatList
      style={{ paddingHorizontal: RFValue(15) }}
      keyExtractor={(item) => item}
      data={languages}
      renderItem={renderItem}
    />
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
    paddingLeft: 10,
  },
  checkbox: {
    width: RFValue(23),
    height: RFValue(23),
    borderRadius: RFValue(26),
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#F4F2F6",
    position: "absolute",
    right: RFValue(10),
  },
});

export default Language;
