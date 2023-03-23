import { RFValue } from "react-native-responsive-fontsize";
import { Svg, G, Rect} from "react-native-svg";

const Rec = ({width=RFValue(24), height=RFValue(24), fill="white"}) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 32 32"
    >
      <G data-name="Group 120102" transform="translate(-434.824 -324.5)">
        <G
          data-name="Group 84376"
          filter="url(#Rectangle_17865)"
          opacity="0.6"
          transform="rotate(-90 395.412 -42.412) rotate(90 15.75 12.75)"
        >
          <G
            fill="none"
            stroke={fill}
            strokeWidth="2"
            data-name="Rectangle 17865"
            opacity="0.8"
            transform="rotate(-90 15.75 12.75)"
          >
            <Rect width="26" height="26" stroke="none" rx="13"></Rect>
            <Rect width="24" height="24" x="1" y="1" rx="12"></Rect>
          </G>
        </G>
        <G
          data-name="Group 84468"
          filter="url(#Rectangle_17865-2)"
          transform="rotate(-90 395.413 -47.267) rotate(90 15.75 7.9)"
        >
          <Rect
            width="16.291"
            height="16.291"
            fill={fill}
            data-name="Rectangle 17865"
            opacity="0.8"
            rx="8.146"
            transform="rotate(-90 15.75 7.9)"
          ></Rect>
        </G>
      </G>
    </Svg>
  );
}

export default Rec;
