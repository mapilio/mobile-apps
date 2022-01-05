import React from "react";
import {Image, TouchableOpacity, View} from "react-native";
import {sequenceCardStyles} from "../styles/userSequenceStyle";
import {Routes} from "../navigator/Routes";
import {RFValue} from "react-native-responsive-fontsize";

const FeedImageCard = (props) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={sequenceCardStyles.cardContainer}
            onPress={() => props.navigation.navigate(Routes.sequenceDetail, {
                id: props.id,
                path: props.path,
                base: true,
            })}
        >
            <View style={sequenceCardStyles.imagePosition}>
                <Image
                    source={{
                        height: RFValue(78),
                        borderRadius: 8,
                        maxWidth: "100%",
                        width: 120,
                        uri: props.path
                    }}
                    resizeMode={"cover"}
                />
            </View>
        </TouchableOpacity>
    );
};

export default FeedImageCard;
