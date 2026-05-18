import React from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';

const Maximize = ({ width = 57, height = 57 }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 57 57">
    <G id="big_picture" transform="translate(-248 -527)">
      <G id="Group_48380" data-name="Group 48380" transform="translate(-60 256)">
        <G
          id="Group_48329"
          data-name="Group 48329"
          transform="translate(19.896 -252.539)"
          opacity="0.6">
          <G id="Group_47447" data-name="Group 47447" transform="translate(294.187 527.622)">
            <G transform="matrix(1, 0, 0, 1, -6.08, -4.08)" filter="url(#Ellipse_445)">
              <Circle
                id="Ellipse_445-2"
                data-name="Ellipse 445"
                cx="22.5"
                cy="22.5"
                r="22.5"
                transform="translate(6 4)"
                fill="#130C47"
              />
            </G>
          </G>
        </G>
      </G>
      <G id="minimize" transform="translate(288.229 565.227) rotate(180)">
        <G id="Group_4161" data-name="Group 4161" transform="translate(0 0)">
          <Path
            id="Path_5675"
            data-name="Path 5675"
            d="M0,.635V22.913a.589.589,0,0,0,.59.59H11.328a.59.59,0,0,0,0-1.179H1.175V1.22h21.1V11.311a.59.59,0,0,0,1.179,0V.635a.585.585,0,0,0-.59-.585H.59A.582.582,0,0,0,0,.635Z"
            transform="translate(0 -0.05)"
            fill="#fff"
          />
          <Path
            id="Path_5676"
            data-name="Path 5676"
            d="M303.054,303.595a.589.589,0,0,0,.59-.59v-8.164a.589.589,0,0,0-.59-.59H294.89a.589.589,0,0,0-.59.59v8.169a.589.589,0,0,0,.59.59h8.164Zm-7.579-8.169h6.994v6.995h-6.994Z"
            transform="translate(-280.192 -280.147)"
            fill="#fff"
          />
          <Path
            id="Path_5677"
            data-name="Path 5677"
            d="M88.2,93.992a.589.589,0,0,0,.59.59h5.249a.589.589,0,0,0,.59-.59v-5.25a.59.59,0,1,0-1.179,0v3.831L86.8,85.924a.586.586,0,0,0-.829.829L92.622,93.4h-3.83A.589.589,0,0,0,88.2,93.992Z"
            transform="translate(98.743 98.692) rotate(180)"
            fill="#fff"
          />
        </G>
      </G>
    </G>
  </Svg>
);

export default Maximize;
