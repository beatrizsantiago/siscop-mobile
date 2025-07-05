import theme from '@/theme';
import { ActivityIndicator } from 'react-native';

const Loading = () => (
  <ActivityIndicator color={theme.primary.main} size="large" />
);

export default Loading;
