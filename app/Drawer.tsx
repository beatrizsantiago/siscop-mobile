import Header from '@/components/Header';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import theme from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardScreen from './Dashboard';

const Drawer = createDrawerNavigator();

const DrawerRoutes = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        header: (props) => <Header {...props} />,
        drawerActiveTintColor: theme.primary.main,
        drawerItemStyle: {
          borderRadius: 8,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.primary.main,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ drawerIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} /> }}
      />
    </Drawer.Navigator>
  </GestureHandlerRootView>
);

export default DrawerRoutes;
