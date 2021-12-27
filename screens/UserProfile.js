import React, {useEffect, useState} from "react";
import {ScrollView, View} from "react-native";
import {ProfileFeed, UserInfos} from "../components";
import {globalStyles} from "../styles/globalStyles";
import {fetchHandler} from "../helper/helper";
import {useSelector} from "react-redux";

const UserProfile = ({navigation}) => {
    const [listData,setListData] = useState([]);
    const {userInformation} = useSelector((state) => state.getTokenReducer);


    useEffect(() => {
        fetchHandler({
            url: `${process.env.API_URL}/api/user-uploads?options[parameters][user_id]=${userInformation.id}`
        })
            .then(res => {
                setListData(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);


    return (
        <View style={globalStyles.container}>
            <UserInfos/>
            <ScrollView>
                {listData.map((data, index) => (
                    <ProfileFeed key={index} data={data} navigation={navigation}/>
                ))}
            </ScrollView>
        </View>
    );
};

export default UserProfile;
