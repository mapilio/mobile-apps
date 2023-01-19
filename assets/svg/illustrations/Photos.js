import Svg, {Path} from "react-native-svg";
import {RFValue} from "react-native-responsive-fontsize";

const Photos = ({width = RFValue(10), height = RFValue(10), color = '#666'}) => (
  <Svg id="photos_1_" xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 10.784 10.784">
    <Path id="Path_91373" data-name="Path 91373" d="M12.54,4.659h-.415V4.244A1.246,1.246,0,0,0,10.881,3H4.244A1.246,1.246,0,0,0,3,4.244v6.636a1.246,1.246,0,0,0,1.244,1.244h.415v.415A1.246,1.246,0,0,0,5.9,13.784H12.54a1.246,1.246,0,0,0,1.244-1.244V5.9A1.246,1.246,0,0,0,12.54,4.659Zm-8.3-.83h6.636a.415.415,0,0,1,.415.415V6.577L8.765,9.469,6.173,7.248a.414.414,0,0,0-.563.022L3.83,9.05V4.244A.415.415,0,0,1,4.244,3.83Zm8.71,8.71a.415.415,0,0,1-.415.415H5.9a.415.415,0,0,1-.415-.415v-.415h5.392a1.246,1.246,0,0,0,1.244-1.244V5.489h.415a.415.415,0,0,1,.415.415Z" transform="translate(-3 -3)" fill={color}/>
    <Path id="Path_91374" data-name="Path 91374" d="M14.244,9.489A1.244,1.244,0,1,0,13,8.244,1.246,1.246,0,0,0,14.244,9.489Z" transform="translate(-8.852 -5.341)" fill={color}/>
  </Svg>
)

export default Photos;
