import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {useForm, Controller} from "react-hook-form";
import React, {useState} from "react";
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {fetchHandler} from "../helper/helper";
import Config from "react-native-config";
import {ProfileCamera} from "../assets/svg/illustrations";
import {getUserInformation} from "../store/reducers/loginReducer/getUserInformation";
import {launchImageLibrary} from "react-native-image-picker";

const ProfileEdit = () => {
  const {bottom} = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(true);


  const {
    userInformation: {
      username,
      user_profile_photo,
      user_bio,
      display_name,
      email
    }
  } = useSelector((state) => state.getTokenReducer);

  const {control, handleSubmit} = useForm({
    defaultValues: {
      username,
      user_profile_photo,
      user_bio,
      display_name,
      email
    }
  });

  const onSubmit = ({user_bio, display_name}) => {
    let data = new FormData()
    data.append("options[parameters][user_bio]", user_bio);
    data.append("options[parameters][display_name]", display_name);

    if (selectedImage) {
      const image = {uri: selectedImage.uri, name: selectedImage.fileName, type: selectedImage.type}

      data.append("options[parameters][user_profile_photo]", image, image.name);
    }

    const url = `${Config.SERVICE_URL}/api/function/user_profile/profile/updateProfile`

    fetchHandler({url, method: 'POST', data}).then(() => {
      dispatch(getUserInformation());
      toast.show(`Update is successfully`, {type: 'success'})
    }).catch((error) => {
      if (error.response.status === 413) {
        toast.show("File size is very large", {type: "error"})
      } else {
        toast.show(error.response.data.message || error, {type: "error"})
      }
    })
  };

  const selectImage = () => {
    launchImageLibrary({selectionLimit: 1, mediaType: "photo", quality: 0}).then(({assets}) => {
      assets && setSelectedImage(assets[0])
    })
  }

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={{flex: 1}}>
      <TouchableWithoutFeedback>
        <ScrollView contentContainerStyle={{flexGrow:1}} >
          <View style={{paddingHorizontal: RFValue(15), flex: 1, justifyContent: "space-between", paddingBottom: RFValue(24)}}>
            <View>
              <View style={{alignItems: "center", paddingTop: RFValue(30)}}>
                <Image
                  source={{uri: selectedImage ? selectedImage.uri : user_profile_photo}}
                  style={{width: RFValue(100), height: RFValue(100), borderRadius: RFPercentage(50)}}
                  onLoadEnd={() => setAvatarLoading(false)}
                />

                {avatarLoading && (
                  <ActivityIndicator
                    color={"#AFAFAF"}
                    style={{
                      width: RFValue(100),
                      height: RFValue(100),
                      borderRadius: RFPercentage(50),
                      position: "absolute",
                      backgroundColor: "#CCC",
                      top: RFValue(30),
                    }}
                  />
                )}

                <Pressable
                  onPress={selectImage}
                  style={{
                    backgroundColor: "#D8D8D8",
                    width: RFValue(30),
                    height: RFValue(30),
                    borderRadius: RFValue(24),
                    transform: [{translate: [RFValue(35), -RFValue(35)]}],
                    borderWidth: RFValue(1),
                    borderColor: '#FFF',
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ProfileCamera />
                </Pressable>
              </View>

              <Controller
                name={'username'}
                control={control}
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#EAEAEA",
                        borderBottomWidth: RFValue(1),
                        paddingVertical: RFValue(15)
                      }}
                    >
                      <Text style={{color: "#666666", fontSize: RFValue(14)}}>Username: </Text>
                      <TextInput
                        name={"username"}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        editable={false}
                        autoCapitalize={"none"}
                        style={{color: "#3F8BE9", fontSize: RFValue(14)}}
                      />
                    </View>
                  )
                }}
              />

              <Controller
                name={'display_name'}
                control={control}
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#EAEAEA",
                        borderBottomWidth: RFValue(1),
                        paddingVertical: RFValue(15)
                      }}
                    >
                      <Text style={{color: "#666666", fontSize: RFValue(14)}}>Name: </Text>
                      <TextInput
                        name={"display_name"}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        autoCapitalize={"none"}
                        style={{color: "#333333", fontSize: RFValue(14), fontWeight: "500", flex: 1}}
                      />
                    </View>
                  )
                }}
              />

              <Controller
                name={'user_bio'}
                control={control}
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#EAEAEA",
                        borderBottomWidth: RFValue(1),
                        paddingVertical: RFValue(15)
                      }}
                    >
                      <TextInput
                        name={"user_bio"}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder={"Bio"}
                        multiline={true}
                        maxLength={150}
                        style={{color: "#333333", fontSize: RFValue(14), fontWeight: "500", flex: 1}}
                      />
                    </View>
                  )
                }}
              />

              <Controller
                name={'email'}
                control={control}
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#EAEAEA",
                        borderBottomWidth: RFValue(1),
                        paddingVertical: RFValue(15)
                      }}
                    >
                      <Text style={{color: "#CCCCCC", fontSize: RFValue(14)}}>Email: </Text>
                      <TextInput
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        autoCapitalize={"none"}
                        editable={false}
                        style={{color: "#CCCCCC", fontSize: RFValue(14), flex: 1}}
                      />
                    </View>
                  )
                }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={{
                backgroundColor: "#3F8BE9",
                borderRadius: RFValue(24),
                alignItems: "center",
                paddingVertical: RFValue(13),
                marginBottom: RFValue(10) + bottom
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontSize: RFValue(16)
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default ProfileEdit;
