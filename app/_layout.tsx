import { useFonts } from 'expo-font';
import 'react-native-reanimated';

import { Text, View } from 'react-native';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/NunitoSans.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Text>
        Hello World!
      </Text>
    </View>
  );
}
