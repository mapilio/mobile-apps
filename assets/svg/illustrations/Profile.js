import React from "react";
import {RFValue} from "react-native-responsive-fontsize";
import {G, Path, Svg} from "react-native-svg";

const Profile = ({width = RFValue(25), height = RFValue(27), fill = '#A5ABC8'}) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24.637 26.438">
        <G opacity="0.7">
            <G transform="translate(0 14.892)">
                <Path
                    d="M29.759,288.389c-7.944,0-12.319,3.758-12.319,10.582a.965.965,0,0,0,.965.965H41.112a.965.965,0,0,0,.965-.965C42.077,292.147,37.7,288.389,29.759,288.389ZM19.4,298.006c.38-5.1,3.858-7.687,10.354-7.687s9.974,2.585,10.354,7.687Z"
                    transform="translate(-17.44 -288.389)" fill="#7e86b0"/>
            </G>
            <G transform="translate(5.918)">
                <Path
                    d="M138.45,0a6.324,6.324,0,0,0-6.4,6.529,6.422,6.422,0,1,0,12.8,0A6.324,6.324,0,0,0,138.45,0Zm0,11.547a4.773,4.773,0,0,1-4.471-5.018,4.388,4.388,0,0,1,4.471-4.6,4.437,4.437,0,0,1,4.471,4.6A4.773,4.773,0,0,1,138.45,11.547Z"
                    transform="translate(-132.049)" fill="#7e86b0"/>
            </G>
        </G>
    </Svg>
);

export default Profile;
