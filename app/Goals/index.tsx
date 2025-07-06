import theme from '@/theme';
import { createStackNavigator } from '@react-navigation/stack';

import Add from './components/Add';
import List from './components/List';
import { GoalProvider } from './context';

const Stack = createStackNavigator();

const Goals = () => (
  <GoalProvider>
    <Stack.Navigator
      screenOptions={{
        animation: 'fade',
        cardStyle: { backgroundColor: theme.background.default },
        headerShown: false,
      }}
    >
      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="AddGoal" component={Add} />
    </Stack.Navigator>
  </GoalProvider>
);

export default Goals;
