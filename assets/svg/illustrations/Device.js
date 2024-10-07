import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { Path } from 'react-native-svg';


const Device = ({ fill="#ececec", width = RFValue(13), height = RFValue(19) }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 12.408 19.493"
    >
      <Path id="Path_305429" data-name="Path 305429"
            d="M-1920.68-11336.784h-7.8c-1.789,0-2.306-.518-2.306-2.306v-14.882c0-1.788.517-2.306,2.306-2.306h1.7v.336a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1v-.336h1.1c1.786,0,2.3.518,2.3,2.306v14.882C-1918.377-11337.3-1918.894-11336.784-1920.68-11336.784Zm-3.9-3.894a.946.946,0,0,0-.946.943.948.948,0,0,0,.946.946.946.946,0,0,0,.943-.946A.944.944,0,0,0-1924.579-11340.678Z"
            transform="translate(1930.785 11356.277)" fill={fill} />
    </Svg>

  );
};

export default Device;