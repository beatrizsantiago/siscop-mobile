import { styled } from 'styled-components/native';

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.background.default};
`;

const MenuItem = styled.TouchableOpacity`
  width: 100%;
  border: ${({ theme }) => `solid 1px ${theme.primary.light}`};
  border-radius: 8px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const IconBox = styled.View`
  align-items: center;
  justify-content: center;
`;

const ContentBox = styled.View`
  flex: 1;
  margin-left: 16px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;

const Description = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.low.medium};
`;

export default {
  Container,
  MenuItem,
  IconBox,
  ContentBox,
  Label,
  Description,
};
