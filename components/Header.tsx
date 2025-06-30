import theme from '@/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getHeaderTitle } from '@react-navigation/elements';
import { StackHeaderProps } from '@react-navigation/stack';
import { Platform, StatusBar, TouchableOpacity } from 'react-native';
import { styled } from 'styled-components/native';

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

const HEADER_LABELS:{ [key:string]: string } = {
  Registration: 'Cadastre-se',
  Login: 'Seja bem vindo(a)',
};

const Header = ({ navigation, route, options }:StackHeaderProps) => {
  const title = getHeaderTitle(options, route.name);
  const label = HEADER_LABELS[title] || title;

  return (
    <Container>
      {label && (
        <TitleRow>
          <Title>{label}</Title>
        </TitleRow>
      )}
      <MainRow>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color={theme.high.main} />
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

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.high.main};
`;

export default Header;
