import theme from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacityProps } from 'react-native';
import { styled } from 'styled-components/native';

type Props = TouchableOpacityProps & {
  iconName: keyof typeof MaterialIcons.glyphMap,
  color?: 'primary' | 'secondary';
  loading?: boolean;
};

const COLORS = {
  primary: theme.primary.main,
  secondary: theme.secondary.main,
};

const IconButton = ({
  iconName, color = 'primary', loading = false, ...rest
}:Props) => {
  const currentBgColor = (() => {
    if (rest.disabled) return theme.gray.medium;
    if (color) return COLORS[color];
    return theme.low.main;
  })();

  return (
    <ButtonBase
      bgColor={currentBgColor}
      {...rest}
    >
      <Icon name={iconName} size={24} />
    </ButtonBase>
  );
};

const ButtonBase = styled.TouchableOpacity<{ bgColor: string }>`
  background-color: ${({ bgColor }) => bgColor};
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const Icon = styled(MaterialIcons)`
  color: ${({ theme }) => theme.high.main};
`;

export default IconButton;