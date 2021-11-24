import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { G, Path } from "react-native-svg";

const Settings = ({ width = RFValue(26), height = RFValue(22) }) => (
  <Svg
    id="logout_2_"
    data-name="logout (2)"
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 26.123 21.957"
  >
    <G id="Group_4707" data-name="Group 4707" transform="translate(0 0)">
      <G id="Group_4706" data-name="Group 4706">
        <G id="previous" transform="translate(26.123 21.957) rotate(180)">
          <Path
            id="Arrow_Left_1_"
            d="M26.013.695c.041.274.905,6.865-2.97,11.4-2.381,2.787-6.055,4.313-10.8,4.464l-.025,4.582a.816.816,0,0,1-1.332.633L.3,13.087a.817.817,0,0,1,0-1.264l10.586-8.77a.816.816,0,0,1,1.334.63l.025,4.685C23.679,8.376,24.492,1.049,24.519.746A.745.745,0,0,1,25.228,0h.028A.767.767,0,0,1,26.013.695ZM10.826,9.776a.817.817,0,0,1-.24-.578V5.411L2.105,12.45l8.481,6.973V15.755a.816.816,0,0,1,.816-.816c4.645,0,8.193-1.345,10.4-3.9a12.034,12.034,0,0,0,2.678-6.225c-1.783,2.436-4.9,5.194-13.073,5.2h0A.815.815,0,0,1,10.826,9.776Z"
            transform="translate(0)"
            fill="#fff"
          />
        </G>
      </G>
    </G>
  </Svg>
);

export default Settings;
