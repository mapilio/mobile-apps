import {Text, View} from "react-native";
import {NoUpload} from "../../assets/svg/illustrations";
import styles from "./EmptyList.styles";
import {useTranslation} from "react-i18next";

const EmptyList = () => {
  const {t} = useTranslation("upload");

  return (
    <View style={styles.container}>
      <NoUpload />

      <Text style={styles.noFeedTitle}>
        {t("no_data.title")}
      </Text>
      <Text style={styles.noFeedDescription}>
        {t("no_data.description")}
      </Text>
    </View>
  );
}

export default EmptyList;
