import { RFValue } from "react-native-responsive-fontsize";
import { Svg, Path } from "react-native-svg";


const AttributionIcon = ({width=RFValue(18), height=RFValue(18)}) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18 18"
    >
      <Path
        fill="#0056F1"
        d="M-3214.365 1838.364A8.942 8.942 0 01-3217 1832a8.943 8.943 0 012.635-6.364A8.943 8.943 0 01-3208 1823a8.94 8.94 0 016.364 2.635A8.941 8.941 0 01-3199 1832a8.94 8.94 0 01-2.636 6.364A8.939 8.939 0 01-3208 1841a8.941 8.941 0 01-6.365-2.636zm-1-6.364a7.372 7.372 0 007.364 7.364 7.372 7.372 0 007.364-7.364 7.372 7.372 0 00-7.364-7.364 7.372 7.372 0 00-7.363 7.364zm7.364 4.09a.818.818 0 01-.818-.818.818.818 0 01.818-.818h.008a.818.818 0 01.818.818.818.818 0 01-.818.818zm-.818-4.09v-3.273a.818.818 0 01.818-.818.819.819 0 01.818.818V1832a.819.819 0 01-.818.818.818.818 0 01-.817-.818z"
        data-name="Path 228871"
        transform="translate(3217 -1823.001)"
      ></Path>
    </Svg>
  );
}

export default AttributionIcon;
