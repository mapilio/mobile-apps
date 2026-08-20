import { isUserInitiatedRegionMovement } from '../../util/mapInteraction';

describe('isUserInitiatedRegionMovement', () => {
  it('recognizes an Android user gesture', () => {
    expect(
      isUserInitiatedRegionMovement({
        nativeEvent: { userInteraction: true, animated: false },
      })
    ).toBe(true);
  });

  it('does not classify an Android developer animation as user movement', () => {
    expect(
      isUserInitiatedRegionMovement({
        nativeEvent: { userInteraction: true, animated: true },
      })
    ).toBe(false);
  });

  it('does not classify non-user camera changes as user movement', () => {
    expect(
      isUserInitiatedRegionMovement({
        nativeEvent: { userInteraction: false, animated: false },
      })
    ).toBe(false);
  });

  it('handles missing or incomplete region events safely', () => {
    expect(isUserInitiatedRegionMovement()).toBe(false);
    expect(isUserInitiatedRegionMovement({})).toBe(false);
    expect(isUserInitiatedRegionMovement({ nativeEvent: {} })).toBe(false);
    expect(
      isUserInitiatedRegionMovement({
        nativeEvent: { userInteraction: true },
      })
    ).toBe(false);
  });
});
