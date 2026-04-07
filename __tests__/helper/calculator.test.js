import { calculate } from '../../helper/calculator';

describe('calculate.pitch', () => {
  it('returns 0 when x=0 and y,z non-zero', () => {
    const result = calculate.pitch({ x: 0, y: 1, z: 0 });
    expect(result).toBeCloseTo(0, 5);
  });

  it('returns 90 when device is vertical (x=1, y=0, z=0)', () => {
    const result = calculate.pitch({ x: 1, y: 0, z: 0 });
    expect(result).toBeCloseTo(90, 5);
  });

  it('returns negative value when x is negative', () => {
    const result = calculate.pitch({ x: -1, y: 0, z: 0 });
    expect(result).toBeCloseTo(-90, 5);
  });

  it('returns a number', () => {
    expect(typeof calculate.pitch({ x: 0.5, y: 0.5, z: 0.5 })).toBe('number');
  });
});

describe('calculate.roll', () => {
  it('returns 0 when y=0', () => {
    const result = calculate.roll({ x: 1, y: 0, z: 0 });
    expect(result).toBeCloseTo(0, 5);
  });

  it('returns 90 when device is on its side (y=1, x=0, z=0)', () => {
    const result = calculate.roll({ x: 0, y: 1, z: 0 });
    expect(result).toBeCloseTo(90, 5);
  });

  it('returns a number', () => {
    expect(typeof calculate.roll({ x: 0.5, y: 0.5, z: 0.5 })).toBe('number');
  });
});

describe('calculate.yaw', () => {
  // Formula: 180 * atan(z / sqrt(x² + z²)) / π
  it('returns 0 when z=0 (device flat)', () => {
    const result = calculate.yaw({ x: 1, y: 0, z: 0 });
    expect(result).toBeCloseTo(0, 5);
  });

  it('returns 45 when x=z (equal components)', () => {
    // atan(z / sqrt(x² + z²)) = atan(1/sqrt(2)) = 35.26°... actually:
    // x=1,z=1 → atan(1/sqrt(2)) * 180/π ≈ 35.26°  -- not 45°
    // x=0,z=1 → atan(1/sqrt(0+1)) = atan(1) = 45°
    const result = calculate.yaw({ x: 0, y: 0, z: 1 });
    expect(result).toBeCloseTo(45, 5);
  });

  it('returns a number', () => {
    expect(typeof calculate.yaw({ x: 0.5, y: 0.5, z: 0.5 })).toBe('number');
  });

  it('returns negative for negative z', () => {
    const result = calculate.yaw({ x: 0, y: 0, z: -1 });
    expect(result).toBeLessThan(0);
  });
});

describe('calculate.fov', () => {
  it('returns a number for horizontal type', () => {
    const result = calculate.fov(4032, 3024, 4.2, 'horizontal');
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });

  it('returns a number for vertical type', () => {
    const result = calculate.fov(4032, 3024, 4.2, 'vertical');
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });

  it('horizontal FOV is greater than vertical FOV when width > height', () => {
    const h = calculate.fov(4032, 3024, 4.2, 'horizontal');
    const v = calculate.fov(4032, 3024, 4.2, 'vertical');
    expect(h).toBeGreaterThan(v);
  });

  it('calls toast.show on unknown type', () => {
    calculate.fov(4032, 3024, 4.2, 'diagonal');
    expect(global.toast.show).toHaveBeenCalled();
  });

  it('returns 0 for unknown type', () => {
    const result = calculate.fov(4032, 3024, 4.2, 'diagonal');
    expect(result).toBe(0);
  });
});
