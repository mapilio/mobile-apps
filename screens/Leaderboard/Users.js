import { useSelector } from 'react-redux';
import LeadersList from '../../components/Leaderboard/LeadersList';

const Users = ({ route }) => {
  const type = route.params.type;

  const { users, usersWeek, usersMonth } = useSelector((state) => state.leaderboardReducer);

  const authUserUsername = useSelector((state) => {
    if (state.getTokenReducer.userInformation) {
      return state.getTokenReducer.userInformation.username;
    }
    return null;
  });

  const typeOfUsers = type === 'all' ? users : type === 'month' ? usersMonth : usersWeek;
  const authUserIndex = typeOfUsers.findIndex((user) =>
    authUserUsername ? user.username === authUserUsername : null
  );

  return (
    <LeadersList
      leaders={typeOfUsers}
      authUserIndex={authUserIndex}
      listType={'users'}
      usersType={type}
    />
  );
};

export default Users;
