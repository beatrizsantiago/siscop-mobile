import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, TextInputProps } from 'react-native';
import { styled } from 'styled-components/native';

type Props = TextInputProps & {
  iconName?: keyof typeof MaterialIcons.glyphMap;
};

const Input = ({ iconName, ...rest }:Props) => (
  <Container disabled={rest.editable === false}>
    {iconName && (
      <Icon name={iconName} size={24} />
    )}
    <Field {...rest} />
  </Container>
);

const Container = styled.View<{ disabled: boolean }>`
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1.5px;
  border-bottom-color: ${({ theme }) => theme.primary.main};
  border-radius: 2px;
  background-color: ${({ theme, disabled }) => disabled ? theme.gray.light : theme.high.main};
`;

const Field = styled(TextInput)`
  height: 48px;
  flex: 1;
`;

const Icon = styled(MaterialIcons)`
  margin-right: 6px;
  margin-left: 6px;
  color: ${({ theme }) => theme.primary.main};
`;

export default Input;