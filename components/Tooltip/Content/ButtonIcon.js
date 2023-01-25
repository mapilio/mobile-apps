import { ArrowRight } from "../../../assets/svg/illustrations";
import { RFValue } from "react-native-responsive-fontsize";

/**
 *
 * @param {string} buttonTitle
 * @description Returns the icon for the tooltip content button
 * @example <ButtonIcon buttonTitle="next" /> => <ArrowRight width={RFValue(12)} height={RFValue(12)}  />
 */
export const ButtonIcon = ({ buttonTitle }) => {
  if (buttonTitle === "next")
    return <ArrowRight width={RFValue(12)} height={RFValue(12)} />;

  return null;
};
