import { Text, View, Alert } from 'react-native';
import { SadWorld } from '../../assets/svg/illustrations';
import styles from './DeleteAccount.styles';
import { Button, FocusAwareStatusBar } from '../../components';
import { Routes } from '../../navigator/Routes';
import { EXIT_USER } from '../../store/actionsName';
import { OneSignal } from 'react-native-onesignal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as AppleAuthentication from 'expo-apple-authentication';
import { LoginManager } from 'react-native-fbsdk-next';
import { useRef, useState } from 'react';
import { mobileAccountApi } from '../../util/helpers/api/MobileAccountApi';
import { authorizeGoogleDeletion } from '../../components/SocialLogin/googleDeletionAuthorization';

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation('delete_account');
  const { credential, userInformation } = useSelector((state) => state.getTokenReducer);
  const [loading, setLoading] = useState(false);
  const deleting = useRef(false);

  const deleteFetch = async (data) => {
    const response = await mobileAccountApi.deleteAccount(data);
    if (response?.response?.success !== true) {
      throw new Error('Account deletion was not confirmed.');
    }
    dispatch({ type: EXIT_USER });
    // Optional SDK cleanup must not turn a confirmed deletion into an error.
    try {
      if (credential.type === 'facebook') {
        LoginManager.logOut();
      }
    } catch {}
    try {
      if (userInformation?.email) {
        OneSignal.User.removeEmail(userInformation.email);
      }
    } catch {}
    navigation.navigate(Routes.tabNavigator, { screen: Routes.map });
  };

  const deleteHandler = async () => {
    if (deleting.current) {
      return;
    }
    if (!credential?.type) {
      Alert.alert(t('login_again'), t('login_again_description'), [
        { text: t('cancel') },
        {
          text: t('ok'),
          onPress: () => navigation.navigate(Routes.stackNavigator, { screen: Routes.auth }),
        },
      ]);

      return;
    }

    deleting.current = true;
    setLoading(true);
    try {
      if (credential.type === 'apple') {
        const credentialState = await AppleAuthentication.getCredentialStateAsync(credential.user);

        if (credentialState !== AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED) {
          throw new Error('Apple authentication is no longer authorized.');
        }
        const { authorizationCode } = await AppleAuthentication.refreshAsync({
          user: credential.user,
        });
        if (!authorizationCode) {
          throw new Error('Apple authentication did not return an authorization code.');
        }
        await deleteFetch({ delete: true, auth_code: authorizationCode, login_type: 'apple' });
      } else if (credential.type === 'google') {
        const providerToken = await authorizeGoogleDeletion();
        if (providerToken === null) {
          return;
        }
        await deleteFetch({ delete: true, login_type: 'google', provider_token: providerToken });
      } else if (credential.type === 'facebook') {
        await deleteFetch({ delete: true, login_type: 'facebook' });
      } else if (credential.type === 'default' || credential.type === 'openstreetmap') {
        await deleteFetch({ delete: true, login_type: 'default' });
      } else {
        throw new Error('Unknown account provider.');
      }
    } catch (e) {
      if (e?.code !== 'ERR_REQUEST_CANCELED') {
        toast.show(t('delete_error'), { type: 'error' });
      }
    } finally {
      deleting.current = false;
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
      <View style={styles.content}>
        <SadWorld />
        <Text style={styles.title}>{t('title')}</Text>
        <Text style={styles.description}>{t('description')}</Text>
      </View>

      <Button
        title={t('delete_account')}
        containerStyle={styles.button}
        disabled={loading}
        loading={loading}
        onPress={() => {
          Alert.alert(t('alert_title'), t('alert_description'), [
            { text: t('cancel') },
            { text: t('delete'), onPress: deleteHandler },
          ]);
        }}
      />
    </View>
  );
};

export default DeleteAccount;
