import Input from '@/components/Input';
import theme from '@/theme';
import Entypo from '@expo/vector-icons/Entypo';
import { useState } from 'react';
import { TextInputProps, View } from 'react-native';
import { styled } from 'styled-components/native';

const PasswordInput = ({ ...rest }:TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Field
        {...rest}
        iconName="password"
        placeholder="Senha"
        secureTextEntry={!showPassword}
        inline
      />
      <IconButton onPress={() => setShowPassword((current) => !current)}>
        {showPassword ? (
          <Entypo name="eye-with-line" size={24} color={theme.gray.dark} />
        ) : (
          <Entypo name="eye" size={24} color={theme.gray.dark} />
        )}
      </IconButton>
    </View>
  );
};

const Field = styled(Input)`
  padding-right: 48px;
`;

const IconButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  padding: 12px;
`;

export default PasswordInput;