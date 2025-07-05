import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, TextInputProps } from 'react-native';
import { styled } from 'styled-components/native';

type Props = TextInputProps & {
  iconName?: keyof typeof MaterialIcons.glyphMap;
  withoutMargin?: boolean;
  width?: string;
  label?: string;
};

const Input = ({ iconName, withoutMargin = false, width = '100%', label, ...rest }:Props) => (
  <>
    {label && (
      <Label>{label}</Label>
    )}
    <Container
      disabled={rest.editable === false}
      withoutMargin={withoutMargin}
      width={width}
      label={label}
    >
      {iconName && (
        <Icon name={iconName} size={24} />
      )}
      <Field {...rest} />
    </Container>
  </>
);

const Container = styled.View<{
  disabled: boolean, withoutMargin: boolean, width: string, label?: string
  }>`
  width: ${({ width }) => width};
  height: ${({ label }) => label ? '40px' : 'auto'};
  margin-bottom: ${({ withoutMargin }) => withoutMargin ? '0px' : '16px'};
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1.5px;
  border-bottom-color: ${({ theme }) => theme.primary.main};
  border-radius: 2px;
  background-color: ${({ theme, disabled }) => disabled ? theme.gray.light : 'transparent'};
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

const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.primary.main};
  font-weight: 500;
  margin-top: 4px;
`;

export default Input;