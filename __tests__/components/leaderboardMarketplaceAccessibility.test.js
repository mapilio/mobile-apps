import React from 'react';
import renderer, { act } from 'react-test-renderer';
import translations from '../../translations';

jest.mock('react-native', () => {
  const React = require('react');
  const TouchableOpacity = (props) =>
    React.createElement('TouchableOpacity', props, props.children);
  const passthrough = (props) => React.createElement('View', props, props.children);
  return {
    Animated: {
      View: passthrough,
      Value: jest.fn(() => 60),
      timing: jest.fn(() => ({ start: jest.fn() })),
    },
    Image: passthrough,
    Platform: { OS: 'ios' },
    StatusBar: {},
    StyleSheet: { create: (styles) => styles },
    Text: passthrough,
    TouchableOpacity,
    View: passthrough,
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: (namespace) => ({
    t: (key, values = {}) => {
      const strings = {
        leaderboard: {
          points_short: 'Pt',
          photos: 'Photos',
          roads: 'Roads',
          view_profile: `View ${values.name}'s profile`,
        },
        marketplace: {
          information: 'Marketplace information',
          tooltip: 'Marketplace tooltip',
        },
      };
      return strings[namespace][key] || key;
    },
  }),
}));

jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: jest.fn() }) }));
jest.mock('react-native-responsive-fontsize', () => ({ RFValue: (value) => value }));
jest.mock('../../components/Leaderboard/FallbackImage', () => 'FallbackImage');
jest.mock('../../components/Leaderboard/UserProfileImage', () => 'UserProfileImage');
jest.mock('../../components/Leaderboard/Rank', () => 'Rank');
jest.mock('../../assets/svg/illustrations', () => ({
  ArrowLeft: 'ArrowLeft',
  CameraFilledIcon: 'CameraFilledIcon',
  Info: 'Info',
  RoadIcon: 'RoadIcon',
}));
jest.mock('../../assets/svg/illustrations/Info', () => 'Info');
jest.mock('../../highordercomponents', () => ({
  CustomText: 'CustomText',
  CustomTextBold: 'CustomTextBold',
}));
jest.mock('../../helper/helper', () => ({ thousandFormatter: (value) => value }));
jest.mock('../../styles/leaderStyles', () => ({ leaderStyles: { authUserListItem: {} } }));
jest.mock('../../styles/marketplaceStyles', () => ({ marketplaceStyles: { popoverText: {} } }));
jest.mock('react-native-popover-view', () => {
  const React = require('react');
  const Popover = (props) => React.createElement('Popover', props, props.children);
  return Object.assign(Popover, { PopoverPlacement: { BOTTOM: 'bottom' } });
});

import ListItem from '../../components/Leaderboard/ListItem';
import MarketplacePopover from '../../components/Marketplace/MarketplacePopover';

const findByType = (tree, type) => tree.root.findAllByType(type);

describe('leaderboard and marketplace accessibility labels', () => {
  it('provides translated labels with the contributor name interpolated for every runtime locale', () => {
    const resources = translations();
    const locales = [
      'ar',
      'cs',
      'da',
      'el',
      'en',
      'es',
      'fi',
      'fr',
      'it',
      'pt',
      'ro',
      'ru',
      'tr',
      'de',
    ];

    locales.forEach((locale) => {
      expect(resources[locale].leaderboard.view_profile).toContain('{{name}}');
      expect(resources[locale].leaderboard.view_own_profile).toBeTruthy();
      expect(resources[locale].marketplace.close_details).toBeTruthy();
      expect(resources[locale].marketplace.information).toBeTruthy();
    });

    let tree;
    act(() => {
      tree = renderer.create(
        <ListItem
          baseStyle={{}}
          displayName="Ada Lovelace"
          displayNameStyle={{}}
          index={0}
          item={{ id: 1, point: 10 }}
        />
      );
    });
    act(() => findByType(tree, 'TouchableOpacity')[0].props.onPress());

    expect(findByType(tree, 'TouchableOpacity')[1].props.accessibilityLabel).toBe(
      "View Ada Lovelace's profile"
    );
  });

  it('activates Marketplace information once per press', () => {
    let tree;
    act(() => {
      tree = renderer.create(<MarketplacePopover />);
    });
    const button = findByType(tree, 'TouchableOpacity')[0];
    const setPopoverVisible = tree.root.findByType('Popover').props;

    expect(button.props.accessibilityLabel).toBe('Marketplace information');
    expect(button.props.onPressIn).toBeUndefined();
    expect(setPopoverVisible.isVisible).toBe(false);

    act(() => button.props.onPress());
    expect(tree.root.findByType('Popover').props.isVisible).toBe(true);
  });
});
