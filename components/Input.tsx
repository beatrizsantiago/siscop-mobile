import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, TextInputProps } from 'react-native';
import { styled } from 'styled-components/native';

type Props = TextInputProps & {
  iconName?: keyof typeof MaterialIcons.glyphMap;
  withoutMargin?: boolean;
  width?: string;
  label?: string;
  inline?: boolean;
};

const Input = ({
  iconName,
  withoutMargin = false,
  width = '100%',
  label,
  inline = false,
  ...rest
}:Props) => (
  <>
    {label && (
      <Label>{label}</Label>
    )}
    <Container
      disabled={rest.editable === false}
      withoutMargin={withoutMargin}
      width={width}
      label={label}
      inline={inline}
    >
      {iconName && (
        <Icon name={iconName} size={24} />
      )}
      <Field {...rest} />
    </Container>
  </>
);

const Container = styled.View<{
  disabled: boolean,
  withoutMargin: boolean,
  width: string,
  label?: string,
  inline?: boolean,
}>`
  width: ${({ width }) => width};
  padding: ${({ inline }) => inline ? '0px' : '0 8px'};
  margin-bottom: ${({ withoutMargin }) => withoutMargin ? '0px' : '16px'};
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom-width: ${({ inline }) => inline ? '1.5px' : '0px' };
  border-bottom-color: ${({ theme, inline }) => inline ? theme.primary.main : 'none' };
  border-radius: ${({ inline }) => inline ? '2px' : '8px' };
  background-color: ${({ theme, disabled, inline }) => (
    disabled ? theme.gray.light : (inline ? 'transparent' : theme.high.main)
  )};
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