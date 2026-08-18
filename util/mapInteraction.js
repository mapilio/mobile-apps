export const isUserInitiatedRegionMovement = (event) =>
  event?.properties?.isUserInteraction === true && event?.properties?.animated === false;
