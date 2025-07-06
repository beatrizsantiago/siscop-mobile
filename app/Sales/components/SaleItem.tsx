import Collapse from '@/components/Collapse';
import Sale from '@/domain/entities/Sale';
import { formatMoney } from '@/utils/format';
import { formatDate } from 'date-fns';
import { useState } from 'react';
import { View } from 'react-native';
import { styled } from 'styled-components/native';
import CancelSaleButton from './CancelSaleButton';

type Props = {
  item: Sale;
};

const SaleItem = ({ item }:Props) => {
  const [showDetails, setShowDetails] = useState(false);

  const isCancelled = item.status === 'CANCELLED';

  return (
    <Container onPress={() => setShowDetails(!showDetails)}>
      {isCancelled && (
        <Chip>
          <ChipText>
            Venda cancelada
          </ChipText>
        </Chip>
      )}
      <Row>
        <View>
          <Title>
            {item.farm.name}
          </Title>
          <Subtitle>
            {formatDate(item.created_at, "dd/MM/yyyy 'às' HH:mm'h'")}
          </Subtitle>
        </View>
        <View>
          <Subtitle>
            Valor total da venda
          </Subtitle>
          <ValueLabel isCancelled={isCancelled}>
            {formatMoney(item.total_value)}
          </ValueLabel>
        </View>
      </Row>
      <Collapse isOpen={showDetails}>
        <View>
          <Divider />
          <Row>
            <Label>Nome</Label>
            <Label>Quant.</Label>
            <Label>Valor unitário</Label>
            <Label>Valor total</Label>
          </Row>
          {item.items.map((i, index) => (
            <Row key={index}>
              <BoldLabel>{i.product.name}</BoldLabel>
              <BoldLabel>{i.amount}</BoldLabel>
              <BoldLabel>{formatMoney(i.unit_value)}</BoldLabel>
              <BoldLabel>{formatMoney(i.total_value)}</BoldLabel>
            </Row>
          ))}

          {!isCancelled && (
            <ButtonBox>
              <CancelSaleButton sale={item} />
            </ButtonBox>
          )}
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
  margin-right: 20px;
`;

const Subtitle = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.low.medium};
  margin-top: 4px;
`;

const ValueLabel = styled.Text<{ isCancelled: boolean }>`
  font-size: 16px;
  font-weight: 700;
  text-align: right;
  color: ${({ theme, isCancelled }) => (isCancelled ? theme.error.main : theme.low.main)};
  text-decoration: ${({ isCancelled }) => (isCancelled ? 'line-through' : 'none')};
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

const ButtonBox = styled.View`
  margin-top: 16px;
`;

const Chip = styled.View`
  background-color: ${({ theme }) => theme.error.main};
  height: 32px;
  width: 140px;
  padding: 0 16px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const ChipText = styled.Text`
  color: ${({ theme }) => theme.high.main};
  font-size: 12px;
  font-weight: 600;
`;

export default SaleItem;
