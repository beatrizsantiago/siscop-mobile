import theme from '@/theme';
import { createStackNavigator } from '@react-navigation/stack';

import Add from './components/Add';
import List from './components/List';
import Update from './components/Update';
import { FarmProvider } from './context';

const Stack = createStackNavigator();

const Farms = () => (
  <FarmProvider>
    <Stack.Navigator
      screenOptions={{
        animation: 'fade',
        cardStyle: { backgroundColor: theme.background.default },
        headerShown: false,
      }}
    >
      <Stack.Screen name="FarmsList" component={List} />
      <Stack.Screen name="AddFarm" component={Add} />
      <Stack.Screen name="UpdateFarm" component={Update} />
    </Stack.Navigator>
  </FarmProvider>
);

export default Farms;
