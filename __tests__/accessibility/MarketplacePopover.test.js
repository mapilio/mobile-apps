import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import Popover from 'react-native-popover-view';
import MarketplacePopover from '../../components/Marketplace/MarketplacePopover';

jest.mock('react-native-popover-view', () => ({
  __esModule: true,
  default: 'Popover',
  PopoverPlacement: { BOTTOM: 'bottom' },
}));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock('react-native-responsive-fontsize', () => ({
  RFValue: (value) => value,
  RFPercentage: (value) => value,
}));
jest.mock('../../assets/svg/illustrations/Info', () => 'Info');
jest.mock('../../highordercomponents', () => ({ CustomText: 'CustomText' }));

it('opens on activation without a press-in event and resets when dismissed', () => {
  let tree;
  act(() => {
    tree = renderer.create(<MarketplacePopover />);
  });

  const trigger = tree.root.findByType(TouchableOpacity);
  expect(trigger.props.accessibilityRole).toBe('button');
  expect(trigger.props.accessibilityLabel).toBe('Marketplace information');
  expect(trigger.props.accessibilityState).toEqual({ expanded: false });
  expect(tree.root.findByType(Popover).props.isVisible).toBe(false);

  act(() => trigger.props.onPress());

  expect(tree.root.findByType(Popover).props.isVisible).toBe(true);
  expect(trigger.props.accessibilityState).toEqual({ expanded: true });

  act(() => tree.root.findByType(Popover).props.onRequestClose());

  expect(tree.root.findByType(Popover).props.isVisible).toBe(false);
  expect(trigger.props.accessibilityState).toEqual({ expanded: false });
  act(() => tree.unmount());
});
