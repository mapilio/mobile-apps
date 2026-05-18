import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const WINDOW_WIDTH = Dimensions.get('window').width;
const ITEM_DISPLAY_NAME = 'SkeletonPlaceholderItem';

const styles = StyleSheet.create({
  placeholderContainer: {
    backgroundColor: 'transparent',
  },
  placeholder: {
    overflow: 'hidden',
  },
});

const getItemStyle = ({ children: _children, style, ...rest }) => (style ? [style, rest] : rest);

const transformToPlaceholder = (rootElement, backgroundColor, radius) => {
  if (!rootElement) return null;
  return React.Children.map(rootElement, (element, index) => {
    if (!element) return null;
    if (element.type === React.Fragment) {
      return <>{transformToPlaceholder(element.props?.children, backgroundColor, radius)}</>;
    }

    const props = element.props || {};
    const childrenProp = props.children;
    const isPlaceholder =
      !childrenProp ||
      typeof childrenProp === 'string' ||
      (Array.isArray(childrenProp) &&
        childrenProp.every((x) => x == null || typeof x === 'string'));

    const style =
      element.type?.displayName === ITEM_DISPLAY_NAME ? getItemStyle(props) : props.style;
    const flat = StyleSheet.flatten(style) || {};

    const borderRadius = props.borderRadius ?? flat.borderRadius ?? radius;
    const width = props.width ?? flat.width;
    const height =
      props.height ??
      flat.height ??
      props.lineHeight ??
      flat.lineHeight ??
      props.fontSize ??
      flat.fontSize;

    const finalStyle = [
      style,
      isPlaceholder ? [styles.placeholder, { backgroundColor }] : styles.placeholderContainer,
      { height, width, borderRadius },
    ];

    return (
      <View
        key={index}
        style={finalStyle}
        children={
          isPlaceholder
            ? undefined
            : transformToPlaceholder(childrenProp, backgroundColor, borderRadius)
        }
      />
    );
  });
};

const SkeletonPlaceholder = ({
  children,
  enabled = true,
  backgroundColor = '#E1E9EE',
  highlightColor = '#F2F8FC',
  speed = 800,
  direction = 'right',
  borderRadius,
  shimmerWidth,
}) => {
  const [layout, setLayout] = useState();
  const animatedValueRef = useRef(new Animated.Value(0));
  const isAnimationReady = Boolean(speed && layout?.width && layout?.height);

  useEffect(() => {
    if (!isAnimationReady) return;
    const loop = Animated.loop(
      Animated.timing(animatedValueRef.current, {
        toValue: 1,
        duration: speed,
        easing: Easing.ease,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [isAnimationReady, speed]);

  const animatedGradientStyle = useMemo(() => {
    const animationWidth = WINDOW_WIDTH + (shimmerWidth ?? 0);
    return {
      ...StyleSheet.absoluteFillObject,
      flexDirection: 'row',
      transform: [
        {
          translateX: animatedValueRef.current.interpolate({
            inputRange: [0, 1],
            outputRange:
              direction === 'right'
                ? [-animationWidth, animationWidth]
                : [animationWidth, -animationWidth],
          }),
        },
      ],
    };
  }, [direction, shimmerWidth]);

  const placeholders = useMemo(() => {
    if (!enabled) return null;
    return (
      <View style={styles.placeholderContainer}>
        {transformToPlaceholder(children, backgroundColor, borderRadius)}
      </View>
    );
  }, [backgroundColor, children, borderRadius, enabled]);

  if (!enabled || !placeholders) return children;
  if (!layout?.width || !layout.height) {
    return <View onLayout={(event) => setLayout(event.nativeEvent.layout)}>{placeholders}</View>;
  }

  return (
    <MaskedView style={{ height: layout.height, width: layout.width }} maskElement={placeholders}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor }]} />
      {isAnimationReady && (
        <Animated.View style={animatedGradientStyle}>
          <LinearGradient
            colors={[backgroundColor, highlightColor, backgroundColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFillObject, shimmerWidth ? { width: shimmerWidth } : null]}
          />
        </Animated.View>
      )}
    </MaskedView>
  );
};

const Item = (props) => <View style={getItemStyle(props)}>{props.children}</View>;
Item.displayName = ITEM_DISPLAY_NAME;
SkeletonPlaceholder.Item = Item;

export default SkeletonPlaceholder;
