import Svg, { G, Path } from 'react-native-svg';

const PhoneCamera = ({ width = 13.139, height = 20.645 }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 13.139 20.645">
      <G id="Group_69940" data-name="Group 69940" transform="translate(-239.418 -572.385)">
        <Path
          id="smartphone_1_"
          data-name="smartphone (1)"
          d="M16.7,1H8.441C6.54,1,6,1.54,6,3.441V19.2c0,1.9.54,2.441,2.441,2.441H16.7c1.9,0,2.441-.54,2.441-2.441V3.441C19.139,1.54,18.6,1,16.7,1Z"
          transform="translate(233.418 571.385)"
          fill="#333"
        />
        <G id="Group_69853" data-name="Group 69853" transform="translate(241.504 575.232)">
          <Path
            id="Union_129"
            data-name="Union 129"
            d="M6.207,11.606a.395.395,0,1,1,0-.789H8.178V8.845a.395.395,0,0,1,.789,0v2.367a.394.394,0,0,1-.394.4Zm-5.813,0a.394.394,0,0,1-.394-.4V8.845a.395.395,0,0,1,.789,0v1.972H2.761a.395.395,0,1,1,0,.789ZM8.178,2.761V.789H6.207a.395.395,0,1,1,0-.789H8.573a.394.394,0,0,1,.394.394V2.761a.395.395,0,1,1-.789,0ZM0,2.761V.394A.394.394,0,0,1,.394,0H2.761a.395.395,0,1,1,0,.789H.789V2.761a.395.395,0,1,1-.789,0Z"
            fill="#fff"
          />
          <Path
            id="Path_22293"
            data-name="Path 22293"
            d="M154.761,225.183h-.789v-.789a.394.394,0,0,0-.789,0v.789h-.789a.394.394,0,0,0,0,.789h.789v.789a.394.394,0,1,0,.789,0v-.789h.789a.394.394,0,0,0,0-.789Z"
            transform="translate(-148.827 -219.769)"
            fill="#fff"
          />
        </G>
        <Path
          id="Path_80496"
          data-name="Path 80496"
          d="M1,0A1,1,0,1,1,0,1,1,1,0,0,1,1,0Z"
          transform="translate(245.418 588.906)"
          fill="#fff"
        />
      </G>
    </Svg>
  );
};

export default PhoneCamera;
