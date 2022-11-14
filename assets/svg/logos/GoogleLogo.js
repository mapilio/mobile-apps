import React from "react";
import Svg, {G, Path} from "react-native-svg";

const GoogleLogo = ({width = 25, height = 25}) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 25.205 25.205">
      <G id="gmail" transform="translate(0)">
        <G id="Group_70527" data-name="Group 70527" transform="translate(0 0)">
          <Path id="Path_2140" data-name="Path 2140" d="M5.586,146.693l-.877,3.275-3.207.068a12.625,12.625,0,0,1-.093-11.768h0l2.855.523,1.251,2.838a7.521,7.521,0,0,0,.071,5.064Z" transform="translate(0 -131.461)" fill="#fbbb00"/>
          <Path id="Path_2141" data-name="Path 2141" d="M273.733,208.176a12.6,12.6,0,0,1-4.493,12.182h0l-3.6-.183L265.135,217a7.51,7.51,0,0,0,3.232-3.835h-6.739v-4.986h12.105Z" transform="translate(-248.749 -197.928)" fill="#518ef8"/>
          <Path id="Path_2142" data-name="Path 2142" d="M49.5,316.607h0a12.606,12.606,0,0,1-18.99-3.856l4.084-3.343a7.5,7.5,0,0,0,10.8,3.838Z" transform="translate(-29.007 -294.177)" fill="#28b446"/>
          <Path id="Path_2143" data-name="Path 2143" d="M47.861,2.9,43.779,6.244A7.494,7.494,0,0,0,32.73,10.168L28.625,6.807h0A12.6,12.6,0,0,1,47.861,2.9Z" transform="translate(-27.215)" fill="#f14336"/>
        </G>
      </G>
    </Svg>
  );
};

export default GoogleLogo;
