import { firebaseAuth } from '@/infrastructure/firebase/auth';
import LoginUseCase from '@/usecases/auth/loginWithGoogle';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Image } from 'react-native';
import { styled } from 'styled-components/native';

const GoogleLoginButton = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const loginUseCase = new LoginUseCase(firebaseAuth);
      await loginUseCase.execute();
      navigation.dispatch(StackActions.replace('Dashboard'));
    } catch {
      Alert.alert(
        'Erro ao fazer login',
        'Ocorreu um erro ao tentar fazer login com o Google. Por favor, tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content>
      <LabelRow>
        <Line />
        <LabelText>ou entre com</LabelText>
        <Line />
      </LabelRow>

      <ButtonBase onPress={handleLogin} disabled={loading}>
        <Image
          source={require('@/assets/images/google.png')}
          style={{ width: 20, height: 20 }}
        />
        <ButtonText>
          Entrar com Google
        </ButtonText>
      </ButtonBase>
    </Content>
  );
};

const Content = styled.View`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
`;

const ButtonBase = styled.TouchableOpacity`
  border: ${({ theme }) => `1.5px solid ${theme.primary.main}`};
  width: 100%;
  height: 48px;
  min-height: 48px;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 8px;
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.primary.main};
  font-weight: 600;
  font-size: 14px;
  text-align: center;
`;

const LabelRow = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const LabelText = styled.Text`
  color: ${({ theme }) => theme.low.medium};
  font-size: 14px;
  font-weight: 500;
`;

const Line = styled.View`
  width: 30%;
  height: 1px;
  background-color: ${({ theme }) => theme.low.medium};
  margin: 16px 0;
`;

export default GoogleLoginButton;
