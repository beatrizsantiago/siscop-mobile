import theme from '@/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { getHeaderTitle } from '@react-navigation/elements';
import { StackActions } from '@react-navigation/native';
import { Alert, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { styled } from 'styled-components/native';

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

const HEADER_LABELS:{ [key:string]: string } = {
  Dashboard: 'Seja bem vindo(a)',
};

const Header = ({ navigation, route, options }:DrawerHeaderProps) => {
  const title = getHeaderTitle(options, route.name);
  const label = HEADER_LABELS[title] || title;

  const handleLogout = () => {
    Alert.alert(
      'Tem certeza que deseja sair?',
      'Você será redirecionado para a tela de login.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: () => navigation.dispatch(StackActions.replace('Login')),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Container>
      <MainRow>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialIcons name="menu" size={28} color={theme.high.main} />
        </TouchableOpacity>

        <Title>{label}</Title>

        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons name="logout" size={28} color={theme.high.main} />
        </TouchableOpacity>
      </MainRow>
    </Container>
  );
};

const Container = styled.View`
  background-color: ${({ theme }) => theme.low.main};
  height: 80px;
  justify-content: center;
  margin-top: ${statusBarHeight}px;
`;

const MainRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.high.main};
`;

export default Header;
