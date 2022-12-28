import { useSelector } from "react-redux";
import LeadersList from "../../components/Leaderboard/LeadersList";

const Organizations = () => {
  const leaderboardOrganizations = useSelector(
    (state) => state.leaderboardReducer.organizations
  );

  return (
    <LeadersList
      leaders={leaderboardOrganizations}
      listType={"organizations"}
      authUserIndex={-1} // For now, we won't implement authUserItemStyles for organizations
    />
  );
};

export default Organizations;
