import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SplashScreen from '../screens/SplashScreen';
import NewLogScreen from '../screens/NewLogScreen';
import HealthJournal from '../screens/HealthJournal';
import SettingsPage from '../screens/Settings';
import { colors } from '../utils/theme';
import Methods from '../utils/methods';
import { TouchableHighlight } from 'react-native';

const Stack = createNativeStackNavigator();
const themeColor = colors.theme_color_3;

export type RootStackParamList = {
  NewLogScreen: undefined;
  HealthJournal: undefined;
  SettingsPage: undefined;
};

const dominantScreen = {
  headerShown: false,
  statusBarShown: false,
  gestureEnabled: false,
};

const stackScreenWithHeader = {
  headerShown: true,
  statusBarShown: true,
  gestureEnabled: false,
};

const headerTitle = {
  fontSize: 22,
  fontWeight: 'bold' as 'bold',
  color: Methods.getContrastColor(themeColor),
}

const NavContainer: React.FC = (): React.ReactElement => {

  const renderMenuButton = ({ navigation }: { navigation: any }) => (
    <TouchableHighlight
      underlayColor='transparent'
      onPress={() => navigation.navigate('SettingsPage')}
      style={{ marginRight: 15 }}>
      <Icon
        name="settings"
        size={32}
        color={Methods.getContrastColor(themeColor)}
      />
    </TouchableHighlight>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ ...dominantScreen, animation: 'fade' }} />
        <Stack.Screen
          name="NewLogScreen"
          component={NewLogScreen}
          options={{
            ...stackScreenWithHeader,
            animation: 'slide_from_left',
            title: 'New Health Log',
            headerTitleStyle: headerTitle,
            headerStyle: { backgroundColor: themeColor }
          }} />
        <Stack.Screen
          name="HealthJournal"
          component={HealthJournal}
          options={({navigation}) => ({
            ...stackScreenWithHeader,
            animation: 'fade',
            title: '  Health Journal',
            headerTitleStyle: headerTitle,
            headerStyle: { backgroundColor: themeColor },
            headerRight: () => renderMenuButton({navigation}),
            headerLeft: () => null,
            headerBackVisible: false,
          })} />
        <Stack.Screen
          name="SettingsPage"
          component={SettingsPage}
          options={({navigation}) => ({
            ...stackScreenWithHeader,
            animation: 'fade',
            title: '  Settings',
            headerTitleStyle: headerTitle,
            headerStyle: { backgroundColor: themeColor },
          })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavContainer;
