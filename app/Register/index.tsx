import Button from '@/components/Button';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import Input from '@/components/Input';
import PasswordInput from '@/components/PasswordInput';
import { firebaseAuth } from '@/infrastructure/firebase/auth';
import RegisterUseCase from '@/usecases/auth/register';
import { isValidEmail } from '@/utils/validations';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Image, TouchableOpacity } from 'react-native';

import Styled from './styled';

const Register = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    const formattedEmail = email.trim();
    const formattedName = name.trim();
    const formattedPassword = password.trim();
    
    if (!isValidEmail(formattedEmail)) {
      Alert.alert('E-mail inválido', 'Por favor, insira um e-mail válido.');
      return;
    }

    if (formattedName.length < 3) {
      Alert.alert('Nome inválido', 'O nome deve ter pelo menos 3 caracteres.');
      return;
    }

    if (formattedPassword.length < 6) {
      Alert.alert('Senha inválida', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const registerUseCase = new RegisterUseCase(firebaseAuth);
      await registerUseCase.execute({
        name: formattedName,
        email: formattedEmail,
        password: formattedPassword,
      });

      navigation.dispatch(StackActions.replace('Dashboard'));
    } catch {
      Alert.alert('Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const disableButton = !name || !email || !password || loading;

  return (
    <Styled.Container>
      <Styled.WhiteBox>
        <Image
          source={require('@/assets/images/brown_logo.png')}
          style={{ width: 50, height: 50 }}
        />

        <Styled.Title>Crie sua conta</Styled.Title>

        <Styled.Subtitle>
          Tenha acesso ao sistema e aproveite todos os recursos disponíveis.
        </Styled.Subtitle>

        <Input
          iconName="person-outline"
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <Input
          iconName="alternate-email"
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <PasswordInput
          value={password}
          onChangeText={setPassword}
        />

        <Styled.ButtonBox>
          <Button
            title="Cadastrar"
            onPress={onSignUpPress}
            disabled={disableButton}
            loading={loading}
          />
        </Styled.ButtonBox>

        <GoogleLoginButton />

        <Styled.LineBox>
          <Styled.WithoutAccountLabel>
            Já possui uma conta?
          </Styled.WithoutAccountLabel>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Styled.BoldText>
              Faça login
            </Styled.BoldText>
          </TouchableOpacity>
        </Styled.LineBox>
      </Styled.WhiteBox>
    </Styled.Container>
  );
};

export default Register;
