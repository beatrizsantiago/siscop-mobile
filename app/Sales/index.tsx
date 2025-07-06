import theme from '@/theme';
import { createStackNavigator } from '@react-navigation/stack';

import Add from './components/Add';
import Main from './components/Main';
import { SaleProvider } from './context';

const Stack = createStackNavigator();

const Sales = () => (
  <SaleProvider>
    <Stack.Navigator
      screenOptions={{
        animation: 'fade',
        cardStyle: { backgroundColor: theme.background.default },
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="AddSale" component={Add} />
    </Stack.Navigator>
  </SaleProvider>
);

export default Sales;
