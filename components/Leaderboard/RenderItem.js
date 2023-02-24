import { leaderStyles as styles } from "../../styles/leaderStyles";
import AuthUserButton from "./AuthUserButton";
import ListItem from "./ListItem";

const renderItem = ({ item, index }, authUserIndex, screenType) => {
  const isAuthUser = index === authUserIndex;

  const displayName =
    screenType === "users" ? item.display_name : item.organization_name;

  const displayNameStyle = isAuthUser
    ? styles.authUserListItem.displayName
    : styles.listItem.displayName;

  const baseStyle = isAuthUser ? styles.authUserListItem : styles.listItem;

  if (isAuthUser) {
    return (
      <AuthUserButton
        authUser={item}
        displayName={displayName}
        rankIndex={index}
      />
    );
  }

  return (
    <ListItem
      item={item}
      baseStyle={baseStyle}
      isAuthUser={isAuthUser}
      index={index}
      displayName={displayName}
      displayNameStyle={displayNameStyle}
    />
  );
};

export default renderItem;
