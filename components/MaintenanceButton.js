import {View} from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { WarningFilled } from "../assets/svg/illustrations";
import CustomText from "../highordercomponents/CustomText";
import { useTranslation } from 'react-i18next';

const MaintenanceButton = () => {
   const {t} = useTranslation("alerts");
    return (
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: RFValue(5),
        }}
      >
        <View
          style={{
            backgroundColor: "#FBA63C1A",
            height: RFValue(60),
            paddingHorizontal: RFValue(10),
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View style={{ marginRight: RFValue(5) }}>
            <WarningFilled width={RFValue(30)} height={RFValue(30)} />
          </View>
          <View>
            <CustomText
              style={{
                fontSize: RFValue(12),
                color: "#191919",
                marginLeft: RFValue(5),
              }}
            >
              {t("maintenanceModeTitle")}
            </CustomText>
            <CustomText
              style={{
                fontSize: RFValue(12),
                color: "#191919",
                marginLeft: RFValue(5),
              }}
            >
              {t("maintenanceModeDescription")}
            </CustomText>
          </View>
        </View>
      </View>
    );
  };

  export default MaintenanceButton;