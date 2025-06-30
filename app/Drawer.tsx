import Header from '@/components/Header';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import DashboardScreen from './Dashboard';

const Drawer = createDrawerNavigator();

const DrawerRoutes = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
      />
    </Drawer.Navigator>
  </GestureHandlerRootView>
);

export default DrawerRoutes;
