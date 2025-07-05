import theme from '@/theme';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { styled } from 'styled-components/native';

type Props = TouchableOpacityProps & {
  title: string,
  outlined?: boolean,
  color?: 'primary' | 'secondary' | 'error';
  loading?: boolean;
};

const COLORS = {
  primary: theme.primary.main,
  secondary: theme.secondary.main,
  error: theme.error.main,
};

const Button = ({
  title, color = 'primary', outlined = false, loading = false, ...rest
}:Props) => {
  const currentBgColor = (() => {
    if (rest.disabled) return theme.gray.medium;
    if (outlined) return 'transparent';
    if (color) return COLORS[color];
    return theme.low.main;
  })();

  const currentColor = COLORS[color];

  return (
    <ButtonBase
      outlined={outlined}
      bgColor={currentBgColor}
      color={currentColor}
      {...rest}
    >
      <TextButton outlined={outlined} color={currentColor}>
        {title}
      </TextButton>
      {loading && (
        <ActivityIndicator
          size="small"
          color={outlined ? currentColor : theme.high.main}
          style={{ marginLeft: 8 }}
        />
      )}
    </ButtonBase>
  );
};

const ButtonBase = styled.TouchableOpacity<{ outlined?:boolean, bgColor: string, color: string }>`
  background-color: ${({ bgColor }) => bgColor};
  border: ${({ outlined, color }) => outlined ? `2px solid ${color}` : 'none'};
  width: 100%;
  height: 48px;
  min-height: 48px;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const TextButton = styled.Text<{  outlined?: boolean, color: string }>`
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  color: ${({ theme, outlined, color }) => outlined ? color : theme.high.main};
`;

export default Button;