import { useSelector } from "react-redux";
import LeadersList from "../../components/Leaderboard/LeadersList";

const Users = () => {
  const leaderboardUsers = useSelector(
    (state) => state.leaderboardReducer.users
  );

  const authUserUsername = useSelector((state) => {
    if (state.getTokenReducer.userInformation) {
      return state.getTokenReducer.userInformation.username;
    }
    return null;
  });
  const authUserIndex = leaderboardUsers.findIndex((user) =>
    authUserUsername ? user.user_username === authUserUsername : null
  );

  return (
    <LeadersList
      leaders={leaderboardUsers}
      authUserIndex={authUserIndex}
      listType={"users"}
    />
  );
};

export default Users;
