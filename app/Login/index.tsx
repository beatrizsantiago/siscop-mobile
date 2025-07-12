import Button from '@/components/Button';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import Input from '@/components/Input';
import PasswordInput from '@/components/PasswordInput';
import { firebaseAuth } from '@/infrastructure/firebase/auth';
import LoginUseCase from '@/usecases/auth/login';
import { isValidEmail } from '@/utils/validations';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Image, TouchableOpacity } from 'react-native';

import Styled from './styled';

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const disableButton = !email || !password || loading;

  const onLoginPress = async () => {
    const formattedEmail = email.trim();
    const formattedPassword = password.trim();
    
    if (!isValidEmail(formattedEmail)) {
      Alert.alert('E-mail inválido', 'Por favor, insira um e-mail válido.');
      return;
    }

    if (formattedPassword.length < 6) {
      Alert.alert('Senha inválida', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const loginUseCase = new LoginUseCase(firebaseAuth);
      await loginUseCase.execute({
        email: formattedEmail,
        password: formattedPassword,
      });
      
      navigation.dispatch(StackActions.replace('Main'));
    } catch {
      Alert.alert('Erro ao fazer login. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Styled.Container>
      <Styled.WhiteBox>
        <Image
          source={require('@/assets/images/brown_logo.png')}
          style={{ width: 50, height: 50 }}
        />

        <Styled.Title>Seja bem-vindo(a)!</Styled.Title>

        <Styled.Subtitle>
          Para acessar o sistema, faça login com seu usuário e senha.
        </Styled.Subtitle>

        <Input
          iconName="alternate-email"
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          inline
        />
        <PasswordInput
          value={password}
          onChangeText={setPassword}
        />

        <Styled.ButtonBox>
          <Button
            title="Entrar"
            onPress={onLoginPress}
            disabled={disableButton}
            loading={loading}
          />
        </Styled.ButtonBox>

        <GoogleLoginButton />

        <Styled.LineBox>
          <Styled.WithoutAccountLabel>
            Não tem uma conta?
          </Styled.WithoutAccountLabel>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Styled.BoldText>
              Cadastre-se
            </Styled.BoldText>
          </TouchableOpacity>
        </Styled.LineBox>
      </Styled.WhiteBox>
    </Styled.Container>
  );
};

export default Login;
