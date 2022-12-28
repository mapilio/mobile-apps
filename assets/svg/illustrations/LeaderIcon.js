import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path } from "react-native-svg";

function LeaderIcon({
  width = RFValue(25),
  height = RFValue(27),
  fill = "#A5ABC8",
}) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 22 25"
    >
      <Path
        fill={fill}
        d="M-1524-639h-12a1 1 0 01-1-1v-3a3 3 0 013-3h3v-2.8h-.016a7.767 7.767 0 01-4.444-2.2h-1.54a4 4 0 01-4-4v-6a1 1 0 011-1h3v-1a1 1 0 011-1h12a1 1 0 011 1v1h3a1 1 0 011 1v6a4 4 0 01-4 4h-1.54a7.945 7.945 0 01-4.46 2.2v2.8h3a3 3 0 013 3v3a1 1 0 01-1 1zm-10-5a1 1 0 00-1 1v2h10v-2a1 1 0 00-1-1zm-.167-18a.834.834 0 00-.833.833V-656a5.006 5.006 0 005 5 5.006 5.006 0 005-5v-5.167a.834.834 0 00-.833-.833zm11.167 2v5a5.993 5.993 0 01-.35 2h.35a2 2 0 002-2v-5zm-16 0v5a2 2 0 002 2h.35a5.994 5.994 0 01-.35-2v-5z"
        data-name="Path 188907"
        transform="translate(1541 664)"
      ></Path>
    </Svg>
  );
}

export default LeaderIcon;
