import React from "react";
import Svg, { Path } from "react-native-svg";

const FacebookLogo = ({width = 11, height = 25}) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 11.963 25.205">
      <Path id="f" d="M262.742,253.744h-4.385v-3.2c0-.981,1.015-1.209,1.489-1.209h2.832v-4.318L259.432,245c-4.428,0-5.44,3.219-5.44,5.284v3.46h-3.214v4.45h3.214v12.011h4.365V258.194h3.707Z" transform="translate(-250.779 -245)" fill="#3b5998"/>
    </Svg>
  );
};

export default FacebookLogo;
