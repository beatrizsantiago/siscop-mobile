import { styled } from 'styled-components/native';

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const HeaderBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  margin-top: 48px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.primary.main};
`;

const NotificationItem = styled.View`
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.gray.light};
  flex-direction: row;
`;

const NotificationContainer = styled.View`
  padding: 0 16px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.primary.main};
`;

const Date = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.low.medium};
`;

const Strong = styled.Text`
  font-weight: 600;
`;

const IconButton = styled.TouchableOpacity`
  position: absolute;
  left: 0px;
`;

export default {
  Container,
  HeaderBox,
  HeaderTitle,
  NotificationItem,
  NotificationContainer,
  Title,
  Date,
  Strong,
  IconButton,
};
