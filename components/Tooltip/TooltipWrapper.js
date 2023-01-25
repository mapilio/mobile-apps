import { View, Platform, Dimensions } from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";
import { useDispatch, useSelector } from "react-redux";
import Content from "./Content";
import {
  nextStep,
  findTooltipType,
  nextStepActionName,
  finishStepsActionName,
} from "../../util/helpers/tooltip";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";
import { SET_TOOLTIP_CAMERA_INITIALIZED, SET_TOOLTIP_CAMERA_STEP, SET_TOOLTIP_TABBAR_INITIALIZED, SET_TOOLTIP_TABBAR_STEP } from "../../store/actionsName";

/**
 * Wrapper for Tooltip component. Content and names must be handled in the consts and helpers files.
 * @param {Object} props
 * @param {string} props.name
 * @param {"left" | "right" | "top" | "bottom" | undefined} props.placement
 * @param {Object} props.content
 * @param {string} props.content.title
 * @param {string} props.content.description
 * @param {string} props.content.buttonTitle
 * @param {React.ReactNode} props.children JSX.Element
 * @returns {JSX.Element} Clone of children with tooltip
 */
const TooltipWrapper = ({ children, name, content, placement = "top", handleNext }) => {
  const dispatch = useDispatch();
  const tooltipType = findTooltipType(name);
  const { top, left, right } = useSafeAreaInsets();

  const { t } = useTranslation("tooltip");

  const { step } = useSelector((state) => state.tooltipReducer[tooltipType]);
  const { welcomeWalkthroughStatus } = useSelector(
    (state) => state.generalReducer
  );

  const { title, description, buttonTitle } = content;

  const isActiveStep = step === name;

  const handleClose = () => {

    if(handleNext){
      handleNext();
    }

    dispatch({
      type: nextStepActionName(name),
      payload: nextStep(name),
    });

    if (nextStep(name) === null) {
      dispatch({
        type: finishStepsActionName(name),
        payload: true,
      });
    }
  };

  const handleSkip = () => {
    dispatch({
      type: finishStepsActionName(name),
      payload: true,
    });
    dispatch({
      type: nextStepActionName(name),
      payload: null,
    });
  };

  const styles = {
    angle: {
      padding: RFValue(20),
      position: "absolute",
      width: "100%",
      borderRadius: RFValue(10),
    },
    list: {
      padding: RFValue(20),
      backgroundColor: "white",
      position: "absolute",
      width: "105%",
      height: "100%",
      borderRadius: RFValue(10),
    },
    apply: {
      padding: RFValue(20),
      backgroundColor: "white",
      position: "absolute",
      height: "110%",
      width: Dimensions.get("window").width,
      borderRadius: RFValue(10),
    },
    tabBar: {
      padding: name === "capture" ? RFValue(40) : RFValue(30),
      backgroundColor: "white",
      position: "absolute",
      opacity: 1,
      borderRadius: Platform.isPad
        ? name === "capture"
          ? RFValue(70)
          : RFValue(10)
        : RFValue(50),
    },
  };

  const skipTextStyle = {
    color: "white",
    fontSize: RFValue(18),
    opacity: 0.7,
    top: top,
    padding: RFValue(20),
  };

  const contentStyle = [
    {
      backgroundColor: "transparent",
    },
    tooltipType === "camera" && {
      minHeight: RFValue(160),
      minWidth: RFValue(200),

    },
  ];

  const skipText = () => {
    switch (name) {
      case "capture":
      case "startCapture":
      case "apply":
        return null;
      default:
        return t("skip");
    }
  }

  const displayInsets =
    tooltipType === "camera"
      ? { left: left, right: right }
      : { left: RFValue(30), right: RFValue(30) };

  const childContentSpacing = Platform.isPad ? RFValue(40) : RFValue(10)

  return (
    <Tooltip
      isVisible={isActiveStep && welcomeWalkthroughStatus} // WalkthroughStatus condition is necessary to prevent tabbar tooltip from showing up on the first launch
      closeOnContentInteraction={false}
      closeOnChildInteraction={false}
      disableShadow={true}
      skipText={skipText()}
      handleSkip={handleSkip}
      skipTextStyle={skipTextStyle}
      useInteractionManager={true}
      closeOnBackgroundInteraction={false}
      allowChildInteraction={false}
      backgroundColor="rgba(0,0,0,0.80)"
      displayInsets={displayInsets}
      contentStyle={contentStyle}
      childContentSpacing={childContentSpacing}
      placement={placement}
      content={
        <Content
          handleClose={handleClose}
          id={name}
          title={title}
          description={description}
          buttonTitle={buttonTitle}
          contentType={tooltipType}
        />
      }
    >
      {isActiveStep && <View style={styles[name] || styles[tooltipType]} />}
      {children}
    </Tooltip>
  );
};

export default TooltipWrapper;
