import SlidingUpPanel from "rn-sliding-up-panel";
import {Languages} from "../index";
import {getContentAreaHeight} from "../../helper/helper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import {CloseIcon, DropdownArrow, Flags} from "../../assets/svg/illustrations";
import {Pressable, StyleSheet, TouchableOpacity, View} from "react-native";
import {CustomText, CustomTextBold} from "../../highordercomponents";
import {useTranslation} from "react-i18next";
import {Fragment, useRef} from "react";
import {useSelector} from "react-redux";

const LanguageModal = () => {
  const {language} = useSelector((state) => state.generalReducer);
  const {top, bottom} = useSafeAreaInsets();
  const {t} = useTranslation('login')
  const languagePanel = useRef();

  return (
    <Fragment>
      <Pressable style={styles.langButton} onPress={() => languagePanel.current?.show()}>
        <Flags flag={language}/>
        <CustomText style={styles.langText}>
          {t(language, {ns: 'languages'})}
        </CustomText>
        <DropdownArrow />
      </Pressable>

      <SlidingUpPanel
        ref={languagePanel}
        draggableRange={{top: getContentAreaHeight(top, bottom), bottom: 0}}
        containerStyle={{backgroundColor: '#FFF', borderRadius: RFValue(10)}}
      >
        <Fragment>
          <View style={styles.header}>
            <TouchableOpacity style={styles.close} onPress={() => languagePanel.current?.hide()}>
              <CloseIcon/>
            </TouchableOpacity>
            <View style={styles.separator}/>
            <CustomTextBold style={styles.title}>
              {t('languages')}
            </CustomTextBold>
          </View>
          <Languages/>
        </Fragment>
      </SlidingUpPanel>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
  },
  close: {
    width: RFValue(24),
    height: RFValue(24),
    borderRadius: RFPercentage(50),
    position: "absolute",
    right: RFValue(20),
    top: RFValue(25),
    backgroundColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  separator: {
    backgroundColor: '#D8D8D8',
    width: RFValue(37),
    height: RFValue(4),
    borderRadius: RFValue(5),
    marginVertical: RFValue(15),
  },
  title: {
    color: '#333333',
    fontSize: RFValue(18),
  },
  langButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginLeft: "auto",
  },
  langText: {
    color: '#FFF',
    paddingHorizontal: RFValue(5),
    fontSize: RFValue(14)
  }
})

export default LanguageModal;
