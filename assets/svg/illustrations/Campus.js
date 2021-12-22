import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, {G, Path} from "react-native-svg";

const Campus = ({ width = RFValue(35), height = RFValue(33) }) => (
    <Svg width={width} height={height} viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <G opacity="0.75">
            <Path opacity="0.75" d="M18.4988 33C27.6115 33 34.9988 25.6127 34.9988 16.5C34.9988 7.3873 27.6115 0 18.4988 0C9.38608 0 1.99878 7.3873 1.99878 16.5C1.99878 25.6127 9.38608 33 18.4988 33Z" fill="#1F304C"/>
            <Path opacity="0.75" d="M18.4988 32.75C27.4734 32.75 34.7488 25.4746 34.7488 16.5C34.7488 7.52537 27.4734 0.25 18.4988 0.25C9.52415 0.25 2.24878 7.52537 2.24878 16.5C2.24878 25.4746 9.52415 32.75 18.4988 32.75Z" stroke="#DADEE3" stroke-width="0.5"/>
        </G>
        <Path opacity="0.77" d="M11.6379 4.00205C13.6091 2.62672 15.9549 1.88928 18.3584 1.88928C20.762 1.88928 23.1077 2.62672 25.0789 4.00205L18.3579 16.419L11.6379 4.00205Z" fill="white"/>
        <Path opacity="0.75" d="M0.0551698 4.15221L5.83941 4.26132C4.51935 5.80819 3.38219 7.5022 2.45048 9.30975L0.0551698 4.15221Z" fill="#C22E2E"/>
    </Svg>
);

export default Campus;
