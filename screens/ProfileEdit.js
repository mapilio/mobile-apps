import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import React, { useState } from 'react';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { galleryPermission } from '../helper/helper';

import { ProfileCamera } from '../assets/svg/illustrations';
import { getUserInformation } from '../store/reducers/loginReducer/getUserInformation';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import { mobileAccountApi } from '../util/helpers/api/MobileAccountApi';

const ProfileEdit = () => {
  const { t } = useTranslation('profile_edit');
  const { bottom } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    userInformation: { username, user_profile_photo, user_bio, display_name, email },
  } = useSelector((state) => state.getTokenReducer);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      username,
      user_profile_photo,
      user_bio,
      display_name,
      email,
    },
  });

  const onSubmit = ({ user_bio, display_name, username }) => {
    setIsLoading(true);

    let data = new FormData();
    data.append('user_bio', user_bio);
    data.append('display_name', display_name);
    data.append('username', username);

    if (selectedImage) {
      const image = {
        uri: selectedImage.uri,
        name: selectedImage.fileName,
        type: selectedImage.type,
      };

      data.append('user_profile_photo', image, image.name);
    }

    mobileAccountApi
      .updateProfile(data)
      .then(() => {
        dispatch(getUserInformation());
        toast.show(`Update is successfully`, { type: 'success' });
      })
      .catch((error) => {
        if (error.response.status === 413) {
          toast.show('File size is very large', { type: 'error' });
        } else {
          toast.show(error.response.data.message || error, { type: 'error' });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const selectImage = () => {
    galleryPermission()
      .then(() => {
        launchImageLibrary({
          selectionLimit: 1,
          mediaType: 'photo',
          quality: 0.7,
          maxHeight: 512,
          maxWidth: 512,
          includeExtra: false,
        }).then(({ assets }) => {
          assets && setSelectedImage(assets[0]);
        });
      })
      .catch((err) => {
        toast.show(err.message, { type: 'error' });
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : ''}
      keyboardVerticalOffset={50}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.formWrapper}>
            <FocusAwareStatusBar barStyle="dark-content" translucent backgroundColor="#fff" />

            <View>
              <View style={{ alignItems: 'center', paddingTop: RFValue(30) }}>
                <Image
                  source={{ uri: selectedImage ? selectedImage.uri : user_profile_photo }}
                  style={styles.profileImage}
                  onLoadEnd={() => setAvatarLoading(false)}
                />

                {avatarLoading && (
                  <ActivityIndicator color={'#AFAFAF'} style={styles.avatarIndicator} />
                )}

                <Pressable onPress={selectImage} style={styles.imageButton}>
                  <ProfileCamera />
                </Pressable>
              </View>

              <Controller
                name={'username'}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>{t('username')}: </Text>
                    <TextInput
                      name={'username'}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      autoCapitalize={'none'}
                      style={{ color: '#333333', fontSize: RFValue(14), fontWeight: '500' }}
                    />
                  </View>
                )}
              />

              <Controller
                name={'display_name'}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>{t('name')}: </Text>
                    <TextInput
                      name={'display_name'}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      autoCapitalize={'none'}
                      style={{
                        color: '#333333',
                        fontSize: RFValue(14),
                        fontWeight: '500',
                        flex: 1,
                      }}
                    />
                  </View>
                )}
              />

              <Controller
                name={'user_bio'}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      name={'user_bio'}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('bio')}
                      multiline={true}
                      maxLength={150}
                      style={{
                        color: '#333333',
                        fontSize: RFValue(14),
                        fontWeight: '500',
                        flex: 1,
                      }}
                    />
                  </View>
                )}
              />

              <Controller
                name={'email'}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Text style={{ color: '#CCCCCC', fontSize: RFValue(14) }}>Email: </Text>
                    <TextInput
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      autoCapitalize={'none'}
                      editable={false}
                      style={{ color: '#CCCCCC', fontSize: RFValue(14), flex: 1 }}
                    />
                  </View>
                )}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              style={{ ...styles.buttonWrapper, marginBottom: RFValue(10) + bottom }}>
              {isLoading ? (
                <ActivityIndicator
                  style={{ paddingVertical: RFValue(3) }}
                  color={'#FFF'}
                  size={'small'}
                />
              ) : (
                <Text style={styles.buttonText}>{t('save')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    flex: 1,
    paddingHorizontal: RFValue(15),
    justifyContent: 'space-between',
    paddingBottom: RFValue(24),
  },
  profileImage: {
    width: RFValue(100),
    height: RFValue(100),
    borderRadius: RFPercentage(50),
  },
  avatarIndicator: {
    width: RFValue(100),
    height: RFValue(100),
    borderRadius: RFPercentage(50),
    position: 'absolute',
    backgroundColor: '#CCC',
    top: RFValue(30),
  },
  imageButton: {
    backgroundColor: '#D8D8D8',
    width: RFValue(30),
    height: RFValue(30),
    borderRadius: RFValue(24),
    transform: [{ translate: [RFValue(35), -RFValue(35)] }],
    borderWidth: RFValue(1),
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#EAEAEA',
    borderBottomWidth: RFValue(1),
    paddingVertical: RFValue(15),
  },
  inputLabel: {
    color: '#666666',
    fontSize: RFValue(14),
  },
  buttonWrapper: {
    backgroundColor: '#3F8BE9',
    borderRadius: RFValue(24),
    alignItems: 'center',
    paddingVertical: RFValue(13),
  },
  buttonText: {
    color: '#FFF',
    fontSize: RFValue(16),
  },
});

export default ProfileEdit;
