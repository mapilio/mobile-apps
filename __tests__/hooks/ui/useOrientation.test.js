import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';

let mockDimensions = { width: 400, height: 800 };

jest.mock('react-native', () => {
  const ReactNative = require('react');

  return {
    Platform: {
      OS: 'ios',
      select: (options) => options.ios ?? options.native ?? options.default,
    },
    NativeModules: {},
    TurboModuleRegistry: {
      get: jest.fn(() => null),
      getEnforcing: jest.fn(() => ({})),
    },
    Text: ({ children }) => ReactNative.createElement('Text', null, children),
    useWindowDimensions: jest.fn(() => mockDimensions),
  };
});

const useOrientation = require('../../../hooks/ui/useOrientation').default;

const OrientationProbe = () => {
  const orientation = useOrientation();

  return <Text>{orientation}</Text>;
};

describe('useOrientation', () => {
  it('follows window dimensions from portrait to landscape and back', () => {
    let probe;

    act(() => {
      probe = renderer.create(<OrientationProbe />);
    });
    expect(probe.root.findByType('Text').props.children).toBe('PORTRAIT');

    mockDimensions = { width: 800, height: 400 };
    act(() => {
      probe.update(<OrientationProbe />);
    });
    expect(probe.root.findByType('Text').props.children).toBe('LANDSCAPE');

    mockDimensions = { width: 400, height: 800 };
    act(() => {
      probe.update(<OrientationProbe />);
    });
    expect(probe.root.findByType('Text').props.children).toBe('PORTRAIT');

    act(() => {
      probe.unmount();
    });
  });
});
