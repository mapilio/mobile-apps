import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";
import { TitleIcon } from "./TitleIcon";
import { ButtonIcon } from "./ButtonIcon";

/**
 * Returns the content of the tooltip
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.buttonTitle
 * @param {string} props.contentType
 * @param {Function?} props.handleClose
 * @returns {JSX.Element} Tooltip content
 *  */
const Content = ({ title, description, buttonTitle, contentType, handleClose }) => {
  const { t } = useTranslation(
    "tooltip",
    {
      keyPrefix: contentType,
    }
  );

  return (
    <View>
      <View style={styles.title.wrap}>
        <Text style={styles.title.text}>
          {t(title)} {""}
        </Text>
        <TitleIcon tabName={title} />
      </View>
      <Text style={styles.description}>{t(description)}</Text>
      <TouchableOpacity onPress={handleClose} style={styles.button}>
        <Text style={styles.button.text}>{t(buttonTitle)} </Text>
        <ButtonIcon buttonTitle={buttonTitle} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    wrap: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    text: {
      color: "white",
      fontSize: RFValue(20),
      fontFamily: "Poppins-SemiBold",
    },
  },
  description: {
    color: "#C2C2C2",
    fontSize: RFValue(13),
    fontFamily: "Poppins",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#0056F1",
    padding: RFValue(10),
    alignItems: "center",
    borderRadius: RFValue(30),
    width: RFValue(110),
    marginTop: RFValue(10),
    text: {
      color: "white",
      fontSize: RFValue(13),
      fontFamily: "Poppins",
    },
  },
});

export default Content;
