import {Languages} from "../index";
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import {DropdownArrow, Flags} from "../../assets/svg/illustrations";
import { TouchableOpacity, StyleSheet, View} from "react-native";
import { CustomText, CustomTextBold} from "../../highordercomponents";
import {useTranslation} from "react-i18next";
import {Fragment, useRef, useMemo, useCallback} from "react";
import {useSelector} from "react-redux";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

const LanguageModal = () => {
  const {language} = useSelector((state) => state.generalReducer);
  const {t} = useTranslation('login')
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => [ "25%"], []);

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} opacity={0.6} appearsOnIndex={0} disappearsOnIndex={-1} />,
    []
  );

  const hideModal = () => {
    bottomSheetRef.current?.dismiss();
  };

  return (
    <Fragment>
      <TouchableOpacity style={styles.langButton} onPress={() =>{
        bottomSheetRef.current?.present()
      }}>
        <Flags flag={language} width={RFValue(23)} height={RFValue(15)} />
        <CustomText style={styles.langText}>
          {t(language, {ns: 'languages'})}
        </CustomText>
        <DropdownArrow  />
      </TouchableOpacity>
     <BottomSheetModal
        index={0}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.separator}
      >
        <Fragment>
          <View style={styles.header}>
            <CustomTextBold style={styles.title}>
              {t('languages')}
            </CustomTextBold>
          </View>
          <Languages onPress={hideModal} isBottomSheet/>
        </Fragment>
      </BottomSheetModal>
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
    borderRadius: RFValue(5),
    
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
    opacity: 0.7,
  },
  langText: {
    color: '#FFF',
    paddingHorizontal: RFValue(5),
    fontSize: RFValue(13),

  }
})

export default LanguageModal;
