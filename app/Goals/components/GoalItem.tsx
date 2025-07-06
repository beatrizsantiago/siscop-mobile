import Collapse from '@/components/Collapse';
import Goal from '@/domain/entities/Goal';
import { GOAL_KINDS } from '@/utils/goalKinds';
import { formatDate } from 'date-fns';
import { useState } from 'react';
import { View } from 'react-native';
import { styled } from 'styled-components/native';

import DeleteButton from './DeleteButton';

type Props = {
  item: Goal;
};

const GoalItem = ({ item }:Props) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Container onPress={() => setShowDetails(!showDetails)}>
      <View>
        <Title>
          Meta de
          {' '}
          <GoalLabel kind={item.kind}>
            {GOAL_KINDS[item.kind]}
          </GoalLabel>
          {' '}
          da fazenda
          {' '}
          <FarmLabel>
            {item.farm.name}
          </FarmLabel>
        </Title>
        <Subtitle>
          {formatDate(item.created_at, "dd/MM/yyyy 'às' HH:mm'h'")}
        </Subtitle>
        <DeleteButton goal={item} />
      </View>
      <Collapse isOpen={showDetails}>
        <View>
          <Divider />
          <Row>
            <Label>Produto</Label>
            <Label>Quantidade</Label>
          </Row>
          {item.items.map((i, index) => (
            <Row key={index}>
              <BoldLabel>{i.product.name}</BoldLabel>
              <BoldLabel>{i.amount}</BoldLabel>
            </Row>
          ))}
        </View>
      </Collapse>
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.background.paper};
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  position: relative;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.low.medium};
  margin-right: 20px;
`;

const Subtitle = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.low.medium};
  margin-top: 4px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.gray.light};
  margin: 16px 0;
`;

const Label = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.low.medium};
  margin-bottom: 8px;
  flex: 1;
`;

const BoldLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.low.main};
  font-weight: 500;
  flex: 1;
`;

const GoalLabel = styled.Text<{ kind: string }>`
  font-size: 16px;
  color: ${({ theme, kind }) => kind === 'SALE' ? theme.blue.dark : theme.secondary.main};
  font-weight: 700;
`;

const FarmLabel = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.primary.main};
  font-weight: 700;
`;

export default GoalItem;
