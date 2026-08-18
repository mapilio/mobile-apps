export const processFacebookProfile = (profile, { onMissingEmail, onValidProfile }) => {
  if (!profile?.email) {
    onMissingEmail();
    return false;
  }

  onValidProfile(profile);
  return true;
};
