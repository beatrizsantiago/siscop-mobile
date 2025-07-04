import theme from '@/theme';
import { createStackNavigator } from '@react-navigation/stack';

import Add from './components/Add';
import List from './components/List';
import Update from './components/Update';
import { ProductProvider } from './context';

const Stack = createStackNavigator();

const Products = () => (
  <ProductProvider>
    <Stack.Navigator
      screenOptions={{
        animation: 'fade',
        cardStyle: { backgroundColor: theme.background.default },
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProductsList" component={List} />
      <Stack.Screen name="AddProduct" component={Add} />
      <Stack.Screen name="UpdateProduct" component={Update} />
    </Stack.Navigator>
  </ProductProvider>
);

export default Products;
