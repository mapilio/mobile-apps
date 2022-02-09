import * as React from "react";
import { Platform } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Svg, { G, Text, TSpan, Path } from "react-native-svg";

const CaptureText = ({ width = RFValue(50), height = RFValue(30) }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 52 31.024"
  >
    <G transform="translate(11892.5 -15055.988)">
      <Text
        transform="translate(-11866.5 15076)"
        fill="#1ad971"
        fontSize={12}
        fontFamily="Poppins-SemiBold, Poppins"
        fontWeight={600}
      >
        <TSpan x={Platform.OS === "android" ? -21 : -25} y={0}>
          {"Capture"}
        </TSpan>
      </Text>
      <G transform="translate(-11885.115 15053.988)">
        <G transform="translate(0 2)">
          <Path
            d="M1.163,9.756A1.164,1.164,0,0,1,0,8.593V6.266A3.952,3.952,0,0,1,3.878,2H6.593a1.163,1.163,0,0,1,0,2.327H3.878c-1.477,0-1.551,1.616-1.551,1.939V8.593A1.164,1.164,0,0,1,1.163,9.756Z"
            transform="translate(0 -2)"
            fill="#fff"
          />
          <G transform="translate(29.473)">
            <Path
              d="M25.593,9.756a1.164,1.164,0,0,1-1.163-1.163V6.266A1.942,1.942,0,0,0,22.49,4.327H20.163a1.163,1.163,0,1,1,0-2.327H22.49a4.269,4.269,0,0,1,4.266,4.266V8.593A1.164,1.164,0,0,1,25.593,9.756Z"
              transform="translate(-19 -2)"
              fill="#fff"
            />
          </G>
          <G transform="translate(0 23.268)">
            <Path
              d="M6.593,24.756H3.878A3.952,3.952,0,0,1,0,20.49V18.163a1.163,1.163,0,0,1,2.327,0V20.49c0,.323.074,1.939,1.551,1.939H6.593a1.163,1.163,0,0,1,0,2.327Z"
              transform="translate(0 -17)"
              fill="#fff"
            />
          </G>
          <G transform="translate(29.473 23.268)">
            <Path
              d="M22.49,24.756H20.163a1.163,1.163,0,1,1,0-2.327H22.49a1.942,1.942,0,0,0,1.939-1.939V18.163a1.163,1.163,0,0,1,2.327,0V20.49A4.269,4.269,0,0,1,22.49,24.756Z"
              transform="translate(-19 -17)"
              fill="#fff"
            />
          </G>
        </G>
      </G>
    </G>
  </Svg>
);

export default CaptureText;
