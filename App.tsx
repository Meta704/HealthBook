import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, BackHandler, ToastAndroid } from 'react-native';
import NavContainer from './src/components/navContainer';
import { colors, dimensions } from './src/utils/theme';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { initialize } from './src/data/database';
import Methods from './src/utils/methods';

interface Props { }

const App: React.FC<Props> = (): React.ReactElement => {
  const [lastBackPressTime, setLastBackPressTime] = useState<number>(0);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: colors.theme_color_3,
    height: dimensions.screenHeight,
  };

  useEffect(() => {
    console.log(Methods.colorizeLog("yellow", "Firebase App Initialized: " + initialize()));
  }, []);

  useEffect(() => {
    const backAction = () => {
      const currentTime = new Date().getTime();
      if (currentTime - lastBackPressTime < 2000) {
        // Double tap
        BackHandler.exitApp();
        return true;
      } else {
        // Single tap
        ToastAndroid.showWithGravity('Tap twice to minimize the app', ToastAndroid.SHORT, ToastAndroid.CENTER);
        setLastBackPressTime(currentTime);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [lastBackPressTime]);

  return (
    <Provider store={store}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor as string}
          translucent={false} />
        <NavContainer />
      </SafeAreaView>
    </Provider>
  );
}

export default App;
