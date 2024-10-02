import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Path, Svg } from 'react-native-svg';

const SDCard = ({ fill = '#ececec', width = RFValue(13), height = RFValue(19)}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14.752 19.67">
      <Path id="sd-card_11269989"
            d="M15.294,0H8.935A3.3,3.3,0,0,0,6.618.961L3.961,3.618A3.258,3.258,0,0,0,3,5.936V19.67H17.752V2.459A2.462,2.462,0,0,0,15.294,0ZM8.737,5.737H7.1V3.278l.82-.82h.82Zm3.278,0H10.376V2.459h1.639Zm3.278,0H13.655V2.459h1.639Z"
            transform="translate(-3)" fill={fill} />
    </Svg>
  );
};

export default SDCard;