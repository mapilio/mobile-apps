import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { G, Path } from 'react-native-svg';

const GPSError = ({ width = RFValue(34), height = RFValue(30) }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 33.894 30.416">
    <G transform="translate(-2.25 -3.25)">
      <Path
        d="M23.318,5.616a4.771,4.771,0,0,0-8.241,0L2.9,26.49a4.771,4.771,0,0,0,4.121,7.176H31.374a4.772,4.772,0,0,0,4.121-7.176L23.318,5.616ZM21.071,6.928a2.17,2.17,0,0,0-3.748,0L5.148,27.8a2.17,2.17,0,0,0,1.874,3.262H31.374A2.17,2.17,0,0,0,33.248,27.8L21.071,6.928Z"
        transform="translate(0 0)"
        fill="#ffc231"
        fill-rule="evenodd"
      />
      <Path
        d="M13.87,17.022v-6.94a1.3,1.3,0,0,0-2.6,0v6.94a1.3,1.3,0,1,0,2.6,0Z"
        transform="translate(6.628 4.065)"
        fill="#ffc231"
        fill-rule="evenodd"
      />
      <Path
        d="M12.569,18.133a1.3,1.3,0,1,0-1.3-1.3A1.3,1.3,0,0,0,12.569,18.133Z"
        transform="translate(6.628 9.027)"
        fill="#ffc231"
      />
    </G>
  </Svg>
);

export default GPSError;
