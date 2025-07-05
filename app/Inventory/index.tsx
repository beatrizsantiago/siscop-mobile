import theme from '@/theme';
import { createStackNavigator } from '@react-navigation/stack';

import Add from './components/Add';
import List from './components/List';
import { InventoryProvider } from './context';

const Stack = createStackNavigator();

const Inventory = () => (
  <InventoryProvider>
    <Stack.Navigator
      screenOptions={{
        animation: 'fade',
        cardStyle: { backgroundColor: theme.background.default },
        headerShown: false,
      }}
    >
      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="AddInventory" component={Add} />
    </Stack.Navigator>
  </InventoryProvider>
);

export default Inventory;
