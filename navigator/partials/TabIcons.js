import {navigatorStyle} from "../../styles/navigatorStyle";
import {Text, View} from "react-native";
import {CaptureIcon, MarketplaceIcon, Profile, TabMap, Upload} from "../../assets/svg/illustrations";

const TabIcons = ({focused, title}) => {
  const icons = {
    Map: <TabMap fill={focused ? "#130C47" : undefined} />,
    Market: <MarketplaceIcon fill={focused ? "#130C47" : undefined}/>,
    Capture: <CaptureIcon fill={focused ? "#130C47" : undefined}/>,
    Upload: <Upload fill={focused ? "#130C47" : undefined}/>,
    Profile: <Profile fill={focused ? "#130C47" : undefined}/>,
  }

  return (
    <View style={[navigatorStyle.tabIconStyle, focused ? navigatorStyle.borderStyle : {}]}>
      {icons[title]}
      <Text
        style={[navigatorStyle.tabTextStyle, focused ? {color: "#130C47"} : {}]}
        numberOfLines={1}
        ellipsizeMode={"clip"}
      >
        {title}
      </Text>
    </View>
  )
}

export default TabIcons;
