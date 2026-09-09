import { View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { FeedList, FocusAwareStatusBar } from '../components';
import { getUserInformation } from '../store/reducers/loginReducer/getUserInformation';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Routes } from '../navigator/Routes';
import { translate } from '../util/helpers';

const UserProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const store = useStore();
  const auth = useSelector((state) => state.getTokenReducer.auth);
  const [profileLoadFailed, setProfileLoadFailed] = useState(false);

  useEffect(() => {
    let isActive = true;
    const { auth: requestAuth, sessionVersion = 0 } = store.getState().getTokenReducer;

    if (requestAuth) {
      dispatch(getUserInformation()).catch(() => {
        const currentSession = store.getState().getTokenReducer;
        if (
          !isActive ||
          !currentSession.auth ||
          (currentSession.sessionVersion ?? 0) !== sessionVersion
        )
          return;
        setProfileLoadFailed(true);

        toast.show(translate('fetch_error', 'profile'), { type: 'error' });
        navigation.goBack();
      });
    }

    return () => {
      isActive = false;
    };
  }, [dispatch, navigation, store]);

  useEffect(() => {
    if (!auth) {
      navigation.getParent().replace(Routes.auth, { screen: Routes.login });
    }
  }, [auth, navigation]);

  return (
    <View
      style={{
        ...globalStyles.container,
        paddingBottom: 0,
        paddingHorizontal: RFValue(0),
        paddingTop: 0,
      }}>
      <FocusAwareStatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
      {auth && !profileLoadFailed && <FeedList />}
    </View>
  );
};

export default UserProfile;
