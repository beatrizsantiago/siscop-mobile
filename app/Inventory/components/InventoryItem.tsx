import Collapse from '@/components/Collapse';
import Inventory from '@/domain/entities/Inventory';
import theme from '@/theme';
import { INVENTORY_STATE_LABELS } from '@/utils/inventoryStateList';
import { formatDate } from 'date-fns';
import { useState } from 'react';
import { View } from 'react-native';
import { styled } from 'styled-components/native';

const STATE_COLORS: { [key: string]: string } = {
  WAITING: theme.tertiary.main,
  IN_PRODUCTION: theme.blue.main,
  READY: theme.secondary.light,
};

type Props = {
  item: Inventory;
};

const InventoryItem = ({ item }:Props) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Container onPress={() => setShowDetails(!showDetails)}>
      <Row>
        <View>
          <Title>{item.farm.name}</Title>
          <Subtitle>{formatDate(item.created_at, "dd/MM/yyyy 'às' HH:mm'h'")}</Subtitle>
        </View>
        <Chip color={STATE_COLORS[item.state]}>
          <ChipText>{INVENTORY_STATE_LABELS[item.state]}</ChipText>
        </Chip>
      </Row>
      <Collapse isOpen={showDetails}>
        <View>
          <Divider />
          <Row>
            <Label>Nome</Label>
            <Label>Quantidade</Label>
            <Label>Ciclo</Label>
          </Row>
          {item.items.map((i, index) => (
            <Row key={index}>
              <BoldLabel>{i.product.name}</BoldLabel>
              <BoldLabel>{i.amount}</BoldLabel>
              <BoldLabel>{i.product.cycle_days} dias</BoldLabel>
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
  font-weight: 500;
  color: ${({ theme }) => theme.low.main};
`;

const Subtitle = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.low.medium};
  margin-top: 4px;
`;

const Chip = styled.View<{ color: string }>`
  background-color: ${({ color }) => color};
  height: 32px;
  padding: 0 16px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`;

const ChipText = styled.Text`
  color: ${({ theme }) => theme.low.main};
  font-size: 12px;
  font-weight: 500;
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

export default InventoryItem;
