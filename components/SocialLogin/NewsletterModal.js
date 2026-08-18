import {
  View,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { CustomText, CustomTextMedium } from '../../highordercomponents';
import AnimatedLottieView from 'lottie-react-native';
import { CloseIcon } from '../../assets/svg/illustrations';
import { Trans, useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../../util/helpers/api';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Fragment } from 'react';
import { SET_MAIL_MODAL_SHOWN } from '../../store/actionsName';
import { captureException } from '@sentry/react-native';

const NewsletterModal = () => {
  const config = useSelector((state) => state.generalReducer.config);
  const { t } = useTranslation(['login', 'register'], { nsMode: 'fallback' });
  const generalState = useSelector((state) => state.generalReducer);
  const dispatch = useDispatch();

  const emailValidationSchema = yup.object().shape({
    email: yup.string().required('email_required').email('email_required'),
  });

  const {
    control,
    handleSubmit,
    formState: {
      errors: { email: emailError },
    },
  } = useForm({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(emailValidationSchema),
  });

  const setMail = (email) => {
    const emailData = new FormData();

    emailData.append('options[parameters][email]', email);

    api
      .post('/api/function/user_profile/profile/updateMail', emailData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.status) {
          dispatch({ type: SET_MAIL_MODAL_SHOWN, payload: false });
        } else {
          dispatch({ type: SET_MAIL_MODAL_SHOWN, payload: false });
          toast.show(t('error'), { type: 'error' });
          captureException(res, {
            tags: {
              functionName: 'setMail',
            },
          });
        }
      })
      .catch((err) => {
        captureException(err, {
          tags: {
            functionName: 'setMail',
          },
        });
        dispatch({ type: SET_MAIL_MODAL_SHOWN, payload: false });
        toast.show(t('error'), { type: 'error' });
      });
  };

  const onSubmit = ({ email }) => {
    setMail(email);
  };

  return (
    <Modal
      visible={!!generalState?.shouldShowMailModal}
      statusBarTranslucent
      transparent
      animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                dispatch({ type: SET_MAIL_MODAL_SHOWN, payload: false });
              }}>
              <CloseIcon color="white" />
            </TouchableOpacity>
            <View style={styles.profileIcon}>
              <AnimatedLottieView
                style={{
                  height: '100%',
                  alignSelf: 'center',
                  transform: [{ scale: 1.2 }],
                }}
                source={require('../../assets/animations/mailSubs.json')}
                autoPlay
                loop
              />
            </View>
            <CustomTextMedium style={styles.title}>
              <Trans
                defaults={
                  i18next.language === 'en' ? config?.osmModal?.titleEN : config?.osmModal?.titleTR
                }
              />
            </CustomTextMedium>
            <CustomText style={styles.description}>
              <Trans
                defaults={
                  i18next.language === 'en'
                    ? config?.osmModal?.descriptionEN
                    : config?.osmModal?.descriptionTR
                }
              />
            </CustomText>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Fragment>
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoCapitalize="none"
                    placeholder={t('enter_email')}
                    style={styles.input}
                  />
                  {emailError && (
                    <CustomText style={styles.infoText}>
                      {t(emailError.message, { ns: 'register' })}
                    </CustomText>
                  )}
                </Fragment>
              )}
            />
            <TouchableOpacity style={styles.buttonApply} onPress={handleSubmit(onSubmit)}>
              <CustomText style={styles.buttonText}>Verify</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  wrapper: {
    backgroundColor: 'white',
    width: '90%',
    height: '45%',
    minHeight: RFValue(320),
    borderRadius: 20,
    marginBottom: RFValue(60),
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(10),
    paddingTop: RFValue(20),
  },
  closeButton: {
    position: 'absolute',
    right: RFValue(10),
    top: RFValue(10),
    width: RFValue(25),
    height: RFValue(25),
    backgroundColor: '#d8d8d8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(25),
  },
  profileIcon: {
    width: '100%',
    height: RFValue(77),
  },
  title: {
    fontSize: RFValue(14),
    color: '#191919',
    marginTop: RFValue(10),
  },
  description: {
    color: '#808080',
    fontSize: RFValue(12),
    marginTop: RFValue(10),
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ECECEC',
    borderRadius: RFValue(24),
    paddingHorizontal: RFValue(21),
    fontSize: RFValue(10),
    fontFamily: 'Poppins-Light',
    width: '80%',
    height: RFValue(40),
    marginTop: RFValue(10),
  },
  buttonApply: {
    marginTop: RFValue(10),
    width: '80%',
    height: RFValue(40),
    borderRadius: RFValue(50),
    justifyContent: 'center',
    backgroundColor: '#0056F1',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: RFValue(13),
  },
  infoText: {
    fontSize: RFValue(8),
    color: '#808080',
    marginTop: 20,
    textAlign: 'center',
  },
});
export default NewsletterModal;
