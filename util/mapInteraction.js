export const isUserInitiatedRegionMovement = (event) => {
  const payload = event?.nativeEvent ?? event;
  return payload?.userInteraction === true && payload?.animated === false;
};
