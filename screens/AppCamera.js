import React,{useState} from "react";
import {View} from "react-native";
import {Camera, CameraSidebar} from "../components";
import {RFValue} from "react-native-responsive-fontsize";

const AppCamera = ({navigation}) => {
    const [takeNow,setTake] = useState(false)

    return (
        <View style={{flex: 1, flexDirection: "row"}}>
            <View style={{flex: 0.78}}>
                <Camera navigation={navigation} takeNow={takeNow}/>
            </View>
            <View
                style={{
                    flex: 0.22,
                    backgroundColor: "#2E2E2E",
                    padding: RFValue(22),
                }}
            >
                <CameraSidebar navigation={navigation} setTake={setTake}/>
            </View>
        </View>
    );
};

export default AppCamera;
