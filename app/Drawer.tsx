import Header from '@/components/Header';
import theme from '@/theme';
import { FontAwesome, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import DashboardScreen from './Dashboard';
import FarmsScreen from './Farms';
import GoalsScreen from './Goals';
import InventoryScreen from './Inventory';
import ProductionScreen from './Production';
import ProductsScreen from './Products';

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
          marginBottom: 12,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ drawerIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} /> }}
      />
      <Drawer.Screen
        name="Products" 
        component={ProductsScreen}
        options={{
          drawerIcon: ({ color }) => <FontAwesome6 name="wheat-awn" size={24} color={color} />,
          drawerLabel: 'Produtos',
          headerTitle: 'Produtos',
        }}
      />
      <Drawer.Screen
        name="Farms" 
        component={FarmsScreen}
        options={{
          drawerIcon: ({ color }) => <FontAwesome6 name="building-wheat" size={24} color={color} />,
          drawerLabel: 'Fazendas',
          headerTitle: 'Fazendas',
        }}
      />
      <Drawer.Screen
        name="Inventory" 
        component={InventoryScreen}
        options={{
          drawerIcon: ({ color }) => <FontAwesome6 name="boxes-packing" size={24} color={color} />,
          drawerLabel: 'Estoque',
          headerTitle: 'Estoque',
        }}
      />
      <Drawer.Screen
        name="Goals" 
        component={GoalsScreen}
        options={{
          drawerIcon: ({ color }) => <FontAwesome name="line-chart" size={24} color={color} />,
          drawerLabel: 'Metas',
          headerTitle: 'Metas',
        }}
      />
      <Drawer.Screen
        name="Production" 
        component={ProductionScreen}
        options={{
          drawerIcon: ({ color }) => <FontAwesome6 name="tractor" size={24} color={color} />,
          drawerLabel: 'Produção',
          headerTitle: 'Produção',
        }}
      />
    </Drawer.Navigator>
  </GestureHandlerRootView>
);

export default DrawerRoutes;
