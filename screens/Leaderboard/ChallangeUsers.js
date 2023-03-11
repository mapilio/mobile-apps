import { useSelector } from "react-redux";
import LeadersList from "../../components/Leaderboard/LeadersList";

const ChallangeUsers = () => {
  const {challangeUsers} = useSelector((state) => state.leaderboardReducer);

  const authUserUsername = useSelector((state) => {
    if (state.getTokenReducer.userInformation) {
      return state.getTokenReducer.userInformation.username;
    }
    return null;
  });
  const authUserIndex = challangeUsers.findIndex((user) =>
    authUserUsername ? user.username === authUserUsername : null
  );

  return (
    <LeadersList
      leaders={challangeUsers}
      authUserIndex={authUserIndex}
      listType={"challange_users"}
    />
  );
};

export default ChallangeUsers;
