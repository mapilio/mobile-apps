export const lightColors = {
  background: '#FFFFFF',
  surface: '#F7F7F7',
  text: '#191919',
  textSecondary: '#666666',
  primary: '#0056F1',
  primaryLight: '#3F8BE9',
  border: '#EAEAEA',
  error: '#EC4E2C',
  success: '#38B35A',
  warning: '#FBA63C',
  info: '#4A90E2',
};

export const darkColors = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#F5F5F5',
  textSecondary: '#A0A0A0',
  primary: '#4B8BF5',
  primaryLight: '#6BA3F7',
  border: '#333333',
  error: '#FF6B4A',
  success: '#4ADE6B',
  warning: '#FFB84D',
  info: '#5BA0F5',
};

export const getColors = (darkMode) => darkMode ? darkColors : lightColors;
