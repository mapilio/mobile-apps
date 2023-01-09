import {navigatorStyle} from "../../styles/navigatorStyle";
import {Text, View} from "react-native";
import {CaptureIcon, MarketplaceIcon, Profile, TabMap, Upload} from "../../assets/svg/illustrations";
import LeaderIcon from "../../assets/svg/illustrations/LeaderIcon";
import {useTranslation} from "react-i18next";

const TabIcons = ({focused, tab}) => {
  const {t} = useTranslation("tab")

  const icons = {
    map: <TabMap fill={focused ? "#130C47" : undefined} />,
    market: <MarketplaceIcon fill={focused ? "#130C47" : undefined} />,
    capture: <CaptureIcon fill={focused ? "#130C47" : undefined} />,
    upload: <Upload fill={focused ? "#130C47" : undefined} />,
    profile: <Profile fill={focused ? "#130C47" : undefined} />,
    leader: <LeaderIcon fill={focused ? "#130C47" : undefined} />,
  };

  return (
    <View style={[navigatorStyle.tabIconStyle, focused ? navigatorStyle.borderStyle : {}]}>
      {icons[tab]}
      <Text
        style={[navigatorStyle.tabTextStyle, focused ? {color: "#130C47"} : {}]}
        numberOfLines={1}
        ellipsizeMode={"clip"}
      >
        {t(tab)}
      </Text>
    </View>
  )
}

export default TabIcons;
