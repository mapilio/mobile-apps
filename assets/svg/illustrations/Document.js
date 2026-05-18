import Svg, { G, Path, Rect } from 'react-native-svg';

const Document = ({ width = 25, height = 25 }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 21.316 21.316">
      <G data-name="Group 69898" transform="translate(-1.984 -2)">
        <Path
          fill="#fff"
          d="M16.1 16.668a.573.573 0 01.573-.573h8.58a.573.573 0 01.573.573v1.18a.573.573 0 01-.573.573h-8.58a.573.573 0 01-.573-.573zm7.435 8.015a.573.573 0 01-.573.573h-6.29a.573.573 0 01-.573-.573v-1.145a.573.573 0 01.573-.573h6.29a.573.573 0 01.573.573zm5.725-3.435a.573.573 0 01-.573.573H16.668a.573.573 0 01-.573-.573V20.1a.573.573 0 01.573-.573h12.015a.573.573 0 01.573.573z"
          data-name="list (4)"
          transform="translate(-10.033 -8.017)"></Path>
      </G>
    </Svg>
  );
};

export default Document;
