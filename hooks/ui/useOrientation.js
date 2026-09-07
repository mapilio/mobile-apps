import { useWindowDimensions } from 'react-native';

/**
 * @returns {string} "PORTRAIT" or "LANDSCAPE"
 * @example
 * const orientation = useOrientation();
 */
const useOrientation = () => {
  const { width, height } = useWindowDimensions();

  return width > height ? 'LANDSCAPE' : 'PORTRAIT';
};

export default useOrientation;
