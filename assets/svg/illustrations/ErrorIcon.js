import * as React from "react";
import Svg, {G, Path, Rect} from "react-native-svg";

const ErrorIcon = ({width = 32, height = 32}) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 32 32">
      <G id="error_icon" transform="translate(18683.084 -8294.916)">
        <Rect id="Rectangle_25981" data-name="Rectangle 25981" width="32" height="32" rx="16" transform="translate(-18683.084 8294.916)" fill="rgba(236,78,44,0.2)"/>
        <Path id="Path_92093" data-name="Path 92093" d="M75.063,211.978l-6.425-10.655a2.873,2.873,0,0,0-4.842,0l-6.425,10.655a2.513,2.513,0,0,0-.042,2.513,2.825,2.825,0,0,0,2.463,1.424h12.85a2.822,2.822,0,0,0,2.463-1.391,2.513,2.513,0,0,0-.042-2.547Zm-8.846.586a.838.838,0,1,1,.592-.245A.837.837,0,0,1,66.217,212.565Zm.838-3.351a.838.838,0,0,1-1.675,0v-3.351a.838.838,0,0,1,1.675,0Z" transform="translate(-18733.301 8102.54)" fill="#ec4e2c"/>
        <Path id="Path_92094" data-name="Path 92094" d="M66.217,212.565a.838.838,0,1,1,.592-.245A.837.837,0,0,1,66.217,212.565Zm.838-3.351a.838.838,0,0,1-1.675,0v-3.351a.838.838,0,0,1,1.675,0Z" transform="translate(-18733.301 8102.54)" fill="#fff"/>
      </G>
    </Svg>
  )
};

export default ErrorIcon;
