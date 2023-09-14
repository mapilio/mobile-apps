import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { Circle, Svg } from "react-native-svg";

const ProgressCircle = ({ value = 0, width = 150, height = 150 }) => {
  const progressValue = useSharedValue(1);
  const radius = width / 2 - RFValue(5);
  const circleLength = 2 * Math.PI * radius;

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const AnimatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset:
        circleLength - (circleLength * progressValue.value) / 100,
    };
  });

  useEffect(() => {
    progressValue.value = withTiming(value, { duration: 1500 });
  }, [value]);

  return (
    <Svg width={width} height={height} style={{position:"absolute"}}>
      <Circle
        cx={width / 2}
        cy={height / 2}
        r={radius}
        stroke="#E5E5E5"
        strokeWidth={RFValue(4)}
      />
      <AnimatedCircle
        cx={width / 2}
        cy={height / 2}
        r={radius}
        stroke="#8F1AF4"
        strokeWidth={RFValue(4)}
        fill="none"
        strokeDasharray={circleLength}
        animatedProps={AnimatedCircleProps}
        strokeLinecap={"round"}
      />
    </Svg>
  );
};
export default ProgressCircle;
