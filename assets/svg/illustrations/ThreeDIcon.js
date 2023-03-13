import { Svg, Path } from "react-native-svg";
import { RFValue } from "react-native-responsive-fontsize";

const ThreeDIcon = ({ width = RFValue(16), height = RFValue(16), fill="#808080" }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width= {width}
      height= {height}
      viewBox="0 0 19.858 19.858"
    >
      <Path
        fill= {fill}
        d="M10.693 145.913l7.638-4.165v-7.59l-7.638 2.781zm-.764-10.323l8.33-3.031-8.33-3.031-8.329 3.031zm9.929-3.007v9.165a1.481 1.481 0 01-.215.776 1.524 1.524 0 01-.585.561l-8.4 4.583a1.483 1.483 0 01-1.456 0L.8 143.084a1.524 1.524 0 01-.585-.561 1.481 1.481 0 01-.215-.775v-9.165a1.49 1.49 0 01.274-.871 1.5 1.5 0 01.726-.561l8.4-3.051a1.492 1.492 0 011.05 0l8.4 3.055a1.528 1.528 0 011 1.432z"
        data-name="3d"
        transform="translate(0 -128)"
      ></Path>
    </Svg>
  );
};

export default ThreeDIcon;
