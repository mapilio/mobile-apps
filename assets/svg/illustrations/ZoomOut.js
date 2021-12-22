import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path } from "react-native-svg";

const ZoomOut = ({ width = RFValue(15), height = RFValue(3) }) => (
    <Svg width={width} height={height} viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M1.51588 0.732056H13.8159C13.9846 0.732056 14.1463 0.799063 14.2656 0.918336C14.3849 1.03761 14.4519 1.19938 14.4519 1.36806C14.4519 1.53673 14.3849 1.6985 14.2656 1.81778C14.1463 1.93705 13.9846 2.00406 13.8159 2.00406H1.51588C1.34721 2.00406 1.18544 1.93705 1.06616 1.81778C0.94689 1.6985 0.879883 1.53673 0.879883 1.36806C0.879883 1.19938 0.94689 1.03761 1.06616 0.918336C1.18544 0.799063 1.34721 0.732056 1.51588 0.732056Z" fill="white"/>
    </Svg>
);

export default ZoomOut;
