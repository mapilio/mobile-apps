import React from "react";
import Svg, {Path} from "react-native-svg";
import {RFValue} from "react-native-responsive-fontsize";

const Trash = ({width = RFValue(21.581), height = RFValue(30.213), color = '#EDEFF1'}) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 21.581 30.213">
    <Path id="_53_Trash_essential_Bin_Spam" data-name="53  Trash, essential, Bin, Spam"
          d="M27.581,6.316H6V8.474H7.079l.939,20.653a3.237,3.237,0,0,0,3.237,3.086H22.283a3.237,3.237,0,0,0,3.237-3.086L26.5,8.474h1.079Zm-4.219,22.66a1.079,1.079,0,0,1-1.079,1.079H11.3a1.079,1.079,0,0,1-1.079-1.025L9.291,8.474H24.344ZM21.106,4.158H12.474V2h8.632Zm-5.4,19.423H13.553V14.948h2.158Zm4.316,0H17.869V14.948h2.158Z"
          transform="translate(-6 -2)" fill={color}/>
  </Svg>
);

export default Trash;
