import { RFValue } from 'react-native-responsive-fontsize';
import { Svg, Path } from 'react-native-svg';

const ToggleOrientation = ({ width = RFValue(23.65), height = RFValue(23.72), fill = '#fff' }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      data-name="Layer 2"
      viewBox="0 0 23.65 23.72">
      <Path
        fill={fill}
        d="M16.284 2.5a10.383 10.383 0 015.885 8.359h1.481A11.872 11.872 0 0011.825 0h-.651l3.769 3.8zm-7.258.93l11.251 11.249-5.653 5.653L3.373 9.072l5.653-5.645m0-2.132a1.481 1.481 0 00-1.047.434l-6.3 6.3a1.481 1.481 0 000 2.1l11.898 11.893a1.551 1.551 0 001.055.434 1.481 1.481 0 001.047-.434l6.289-6.3a1.473 1.473 0 000-2.1L10.08 1.729a1.481 1.481 0 00-1.047-.434zM7.39 21.262a10.4 10.4 0 01-5.909-8.4H0A11.872 11.872 0 0011.825 23.72h.651l-3.768-3.769z"
        data-name="Layer 1"></Path>
    </Svg>
  );
};

export default ToggleOrientation;
