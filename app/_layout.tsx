import theme from '@/theme';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import DrawerRoutes from './Drawer';
import LoginScreen from './Login';
import NotificationsScreen from './Notifications';
import RegisterScreen from './Register';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

const Routes = () => (
  <Stack.Navigator
    screenOptions={{
      animation: 'fade',
      cardStyle: { backgroundColor: theme.background.default },
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Main" component={DrawerRoutes} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/NunitoSans.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Routes />  
    </ThemeProvider>
  );
};
