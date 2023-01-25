import {
  SET_TOOLTIP_CAMERA_STEP,
  SET_TOOLTIP_MARKETPLACE_STEP,
  SET_TOOLTIP_TABBAR_STEP,
  SET_TOOLTIP_TABBAR_INITIALIZED,
  SET_TOOLTIP_MARKETPLACE_INITIALIZED,
  SET_TOOLTIP_CAMERA_INITIALIZED,
} from "../../../store/actionsName";
import { tooltipSteps } from "../../consts/tooltip";

/**
 * Find next step name based on tooltipSteps
 * @param {string} name
 * @returns  {string} next step name
 */
export const nextStep = (name) => {
  let nextStepName = null;

  Object.keys(tooltipSteps).forEach((key) => {
    const index = tooltipSteps[key].indexOf(name);
    if (index !== -1 && index < tooltipSteps[key].length - 1)
      nextStepName = tooltipSteps[key][index + 1];
  });

  return nextStepName;
};

/**
 * Find tooltip type based on tooltipSteps
 * @param {string} tooltip name
 * @returns {"tabBar" | "marketplace" | "camera" | null} tooltip type  that based on redux state
 */
export const findTooltipType = (name) => {
  let tooltipType = null;

  Object.keys(tooltipSteps).forEach((key) => {
    const index = tooltipSteps[key].indexOf(name);
    if (index !== -1) tooltipType = key;
  });
  return tooltipType;
};

/**
 * Find next step action name based on tooltip type
 * @param {string} name
 * @returns {"SET_TOOLTIP_TABBAR_STEP" | "SET_TOOLTIP_MARKETPLACE_STEP" | "SET_TOOLTIP_CAMERA_STEP" | null} action name
 */
export const nextStepActionName = (name) => {
  const tooltipType = findTooltipType(name);

  switch (tooltipType) {
    case "tabBar":
      return SET_TOOLTIP_TABBAR_STEP;
    case "marketplace":
      return SET_TOOLTIP_MARKETPLACE_STEP;
    case "camera":
      return SET_TOOLTIP_CAMERA_STEP;
    default:
      return null;
  }
};

/**
 * Find "finish step" action name based on tooltip type
 * @param {string} name
 * @returns {"SET_TOOLTIP_TABBAR_INITIALIZED" | "SET_TOOLTIP_MARKETPLACE_INITIALIZED" | "SET_TOOLTIP_CAMERA_INITIALIZED" | null} action name
 */
export const finishStepsActionName = (name) => {
  const tooltipType = findTooltipType(name);

  switch (tooltipType) {
    case "tabBar":
      return SET_TOOLTIP_TABBAR_INITIALIZED;
    case "marketplace":
      return SET_TOOLTIP_MARKETPLACE_INITIALIZED;
    case "camera":
      return SET_TOOLTIP_CAMERA_INITIALIZED;
    default:
      return null;
  }
};
