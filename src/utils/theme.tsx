import { Dimensions, Platform } from 'react-native';

interface DimensionsProps {
  screenWidth: number;
  screenHeightFull: number;
  screenHeight: number;
  navigationBarHeight: number;
}

interface ConsoleColors {
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  blackBackground: string;
  redBackground: string;
  greenBackground: string;
  yellowBackground: string;
  blueBackground: string;
  magentaBackground: string;
  cyanBackground: string;
  whiteBackground: string;
  reset: string;
  bold: string;
  underline: string;
  blink: string;
  inverse: string;
  hidden: string;
}

interface ColorsProps {
  black: string;
  white: string;
  baseColor: string;
  negative: string;
  theme_color_1: string;
  theme_color_2: string;
  theme_color_3: string;
  theme_color_4: string;
  theme_color_5: string;
  google: string;
  placeholder: string;
  disabled: string;
  dataText: string;
  warning: string;
  pinned: string;
  dark: string;
  light: string;
  backlight: string;
}

interface StatesProps {
  isDarkMode: boolean;
}

const { 
  width: screenWidth, 
  height: screenHeight 
} = Dimensions.get('window');

const navigationBarHeight = Platform.OS === 'android' ? Math.round(Dimensions.get('screen').height - screenHeight) : 0;

const useThemedStyles = () => {
  const isDarkMode = (false);
  // const isDarkMode = (useColorScheme() === 'dark');
  
  const dimensions: DimensionsProps = {
    screenWidth,
    screenHeightFull: screenHeight,
    screenHeight: screenHeight - navigationBarHeight,
    navigationBarHeight,
  };

  const consoleColors: ConsoleColors = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    blackBackground: '\x1b[40m',
    redBackground: '\x1b[41m',
    greenBackground: '\x1b[42m',
    yellowBackground: '\x1b[43m',
    blueBackground: '\x1b[44m',
    magentaBackground: '\x1b[45m',
    cyanBackground: '\x1b[46m',
    whiteBackground: '\x1b[47m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    underline: '\x1b[4m',
    blink: '\x1b[5m',
    inverse: '\x1b[7m',
    hidden: '\x1b[8m',
  };
  
  const colors: ColorsProps = {
    black: '#000',
    white: '#fff',
    baseColor: isDarkMode ? '#000' : '#fff',
    negative: !isDarkMode ? '#000' : '#fff',
    theme_color_1: '#368a4c', //dark green
    theme_color_2: '#6dad7f', //green
    theme_color_3: '#87c4a1', //light green
    theme_color_4: '#3b9596', //teal
    theme_color_5: '#b4d4c2', //lighter green
    google: '#DB4437',
    placeholder: '#969696',
    disabled: '#dbdbdb',
    dataText: '#5c5c5c',
    warning: '#cf3723',
    pinned: '#f57e2a',
    dark: '#454545',
    light: '#dedede',
    backlight: 'rgba(0, 0, 0, 0.5)',
  };
  
  const states: StatesProps = {
    isDarkMode: isDarkMode,
  };

  return { dimensions, colors, states, consoleColors };
};

export const dimensions = useThemedStyles().dimensions;
export const colors = useThemedStyles().colors;
export const consoleColors = useThemedStyles().consoleColors;
export const states = useThemedStyles().states;
