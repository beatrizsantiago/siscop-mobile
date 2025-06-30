import { styled } from 'styled-components/native';

const Container = styled.SafeAreaView`
  flex: 1;
  padding: 16px;
  justify-content: center;
  align-items: center;
`;

const WhiteBox = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.high.main};
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary.main};
  margin: 8px 0;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.low.medium};
  text-align: center;
  margin-bottom: 16px;
`;

const ButtonBox = styled.View`
  margin-top: 16px;
  width: 100%;
`;

const LineBox = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  gap: 6px;
`;

const WithoutAccountLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.low.medium};
  text-align: center;
`;

const BoldText = styled.Text`
  font-weight: 600;
  color: ${({ theme }) => theme.primary.main};
  line-height: 14px;
`;

export default {
  Container,
  WhiteBox,
  Title,
  Subtitle,
  ButtonBox,
  LineBox,
  WithoutAccountLabel,
  BoldText,
};
