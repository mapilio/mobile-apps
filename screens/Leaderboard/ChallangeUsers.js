import { useSelector } from "react-redux";
import LeadersList from "../../components/Leaderboard/LeadersList";

const ChallangeUsers = () => {
  const {challengeUsers} = useSelector((state) => state.leaderboardReducer);

  const authUserUsername = useSelector((state) => {
    if (state.getTokenReducer.userInformation) {
      return state.getTokenReducer.userInformation.username;
    }
    return null;
  });
  const authUserIndex = challengeUsers.findIndex((user) =>
    authUserUsername ? user.username === authUserUsername : null
  );

  return (
    <LeadersList
      leaders={challengeUsers}
      authUserIndex={authUserIndex}
      listType={"challange_users"}
    />
  );
};

export default ChallangeUsers;
