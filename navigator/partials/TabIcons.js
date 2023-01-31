import {navigatorStyle} from "../../styles/navigatorStyle";
import { Text, View } from "react-native";
import {
  CaptureIcon,
  MarketplaceIcon,
  Profile,
  TabMap,
  Upload,
} from "../../assets/svg/illustrations";
import LeaderIcon from "../../assets/svg/illustrations/LeaderIcon";
import { useTranslation } from "react-i18next";
import { TooltipWrapper } from "../../components/Tooltip";
import { tooltipContents } from "../../util/consts/tooltip";
import { useSelector } from "react-redux";

const TabIcons = ({ focused, tab }) => {
  const { t } = useTranslation("tab");
  const { isInitialized } = useSelector((state) => state.tooltipReducer.tabBar);

  const iconColor = () => {
    if (!isInitialized || focused) return "#130C47";
    return undefined;
  };

  const textColor = () => {
    if (!isInitialized || focused) return { color: "#130C47" };
    return {};
  };

  const icons = {
    map: <TabMap fill={iconColor()} />,
    market: <MarketplaceIcon fill={iconColor()} />,
    capture: <CaptureIcon fill={iconColor()} />,
    upload: <Upload fill={iconColor()} />,
    profile: <Profile fill={iconColor()} />,
    leader: <LeaderIcon fill={iconColor()} />,
  };

  return (
    <View style={navigatorStyle.tabIconStyle}>
      <TooltipWrapper name={tab} content={tooltipContents.tabBar[tab]}>
        <View style={{ alignItems: "center" }}>
          {icons[tab]}
          <Text
            style={[navigatorStyle.tabTextStyle, textColor()]}
            numberOfLines={1}
            ellipsizeMode={"clip"}
          >
            {t(tab)}
          </Text>
        </View>
      </TooltipWrapper>
    </View>
  );
};

export default TabIcons;
