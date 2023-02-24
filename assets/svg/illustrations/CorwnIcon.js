import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path } from "react-native-svg";
const CrownIcon = ({
  width = RFValue(22),
  height = RFValue(22),
  fill = "#FBA63C",
  ...props
}) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 22 20.174"
      {...props}
    >
      <Path
        fill={fill}
        d="M18.333 17.5H3.667a1.833 1.833 0 100 3.667h14.666a1.833 1.833 0 100-3.667zm1.834-11.917a1.833 1.833 0 00-1.833 1.833 1.871 1.871 0 00.038.375l-3.329 2-2.806-5.613a1.833 1.833 0 10-2.475 0L6.957 9.79l-3.329-2a1.871 1.871 0 00.039-.375 1.833 1.833 0 10-1.834 1.834c.034 0 .065-.008.1-.01l.709 6.427H19.36l.709-6.427c.033 0 .064.01.1.01a1.833 1.833 0 000-3.667z"
        data-name="30. Crown"
        transform="translate(0 -.992)"
      ></Path>
    </Svg>
  );
};

export default CrownIcon;
