import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SkeletonPlaceholder from '../../components/Skeleton';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

const renderMeasured = (element, layout = { width: 120, height: 24 }) => {
  let tree;
  act(() => {
    tree = renderer.create(element);
  });

  const measuredContainer = tree.root.find((node) => node.type === View && node.props.onLayout);
  act(() => {
    measuredContainer.props.onLayout({ nativeEvent: { layout } });
  });

  return tree;
};

const mockAnimationLoop = () => {
  const loops = [];
  jest.spyOn(Animated, 'loop').mockImplementation(() => {
    const loop = { start: jest.fn(), stop: jest.fn() };
    loops.push(loop);
    return loop;
  });
  return loops;
};

describe('SkeletonPlaceholder', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns children unchanged when disabled', () => {
    const child = <View testID="content" />;
    let tree;
    act(() => {
      tree = renderer.create(<SkeletonPlaceholder enabled={false}>{child}</SkeletonPlaceholder>);
    });

    expect(tree.root.findByProps({ testID: 'content' }).props).toEqual(child.props);
  });

  it('keeps the placeholder static when speed is zero', () => {
    const loop = jest.spyOn(Animated, 'loop');
    const tree = renderMeasured(
      <SkeletonPlaceholder speed={0}>
        <SkeletonPlaceholder.Item width={120} height={24} />
      </SkeletonPlaceholder>
    );

    expect(loop).not.toHaveBeenCalled();
    expect(tree.root.findAllByType(LinearGradient)).toHaveLength(0);
  });

  it('clips each leaf shimmer to the leaf bounds', () => {
    mockAnimationLoop();
    const tree = renderMeasured(
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item width={120} height={24} />
      </SkeletonPlaceholder>
    );

    const leaf = tree.root
      .findAllByType(View)
      .find((node) => StyleSheet.flatten(node.props.style)?.backgroundColor === '#E1E9EE');

    expect(StyleSheet.flatten(leaf.props.style).overflow).toBe('hidden');
    expect(leaf.findAllByType(LinearGradient)).toHaveLength(1);
  });

  it('preserves nested SkeletonPlaceholder.Item layout styles', () => {
    mockAnimationLoop();
    const tree = renderMeasured(
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item
          width={200}
          height={60}
          flexDirection="row"
          alignItems="center"
          marginTop={12}>
          <SkeletonPlaceholder.Item width={40} height={40} />
          <SkeletonPlaceholder.Item width={100} height={16} marginLeft={8} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>,
      { width: 200, height: 72 }
    );

    const nestedContainer = tree.root.findAllByType(View).find((node) => {
      const style = StyleSheet.flatten(node.props.style);
      return style?.flexDirection === 'row' && style?.width === 200;
    });
    const nestedStyle = StyleSheet.flatten(nestedContainer.props.style);

    expect(nestedStyle).toEqual(
      expect.objectContaining({
        width: 200,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        backgroundColor: 'transparent',
      })
    );

    const leafStyles = nestedContainer
      .findAllByType(View)
      .map((node) => StyleSheet.flatten(node.props.style))
      .filter((style) => style?.backgroundColor === '#E1E9EE');
    expect(leafStyles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ width: 40, height: 40, borderRadius: 4 }),
        expect.objectContaining({
          width: 100,
          height: 16,
          marginLeft: 8,
          borderRadius: 4,
        }),
      ])
    );
  });

  it('renders a clipped synchronized gradient in every leaf', () => {
    mockAnimationLoop();
    const tree = renderMeasured(
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item width={60} height={12} />
        <SkeletonPlaceholder.Item width={90} height={18} />
      </SkeletonPlaceholder>,
      { width: 90, height: 30 }
    );

    const leaves = tree.root.findAllByType(View).filter((node) => {
      const style = StyleSheet.flatten(node.props.style);
      return style?.backgroundColor === '#E1E9EE';
    });

    expect(leaves).toHaveLength(2);
    expect(
      leaves.every(
        (leaf) =>
          StyleSheet.flatten(leaf.props.style).overflow === 'hidden' &&
          leaf.findAllByType(LinearGradient).length === 1
      )
    ).toBe(true);
    expect(Animated.loop).toHaveBeenCalledTimes(1);
  });

  it('stops the animation loop on unmount', () => {
    const loops = mockAnimationLoop();
    const tree = renderMeasured(
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item width={120} height={24} />
      </SkeletonPlaceholder>
    );

    expect(loops).toHaveLength(1);
    expect(loops[0].start).toHaveBeenCalledTimes(1);

    act(() => {
      tree.unmount();
    });

    expect(loops[0].stop).toHaveBeenCalledTimes(1);
  });

  it('stops the animation loop when animation becomes disabled', () => {
    const loops = mockAnimationLoop();
    const child = <SkeletonPlaceholder.Item width={120} height={24} />;
    const tree = renderMeasured(<SkeletonPlaceholder>{child}</SkeletonPlaceholder>);

    act(() => {
      tree.update(<SkeletonPlaceholder speed={0}>{child}</SkeletonPlaceholder>);
    });

    expect(loops).toHaveLength(1);
    expect(loops[0].stop).toHaveBeenCalledTimes(1);
  });
});
