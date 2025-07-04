import IconButton from '@/components/IconButton';
import { formatMoney } from '@/utils/format';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { styled } from 'styled-components/native';

import { useProductContext } from '../context';
import DeleteButton from './DeleteButton';
import Search from './Search';

const List = () => {
  const navigation = useNavigation();

  const { state } = useProductContext();

  return (
    <Container>
      <TopRow>
        <Search />
        <IconButton
          iconName="add"
          onPress={() => navigation.navigate('AddProduct')}
        />
      </TopRow>
      {state.products.map((product) => (
        <ProductItem
          key={product.id}
          onPress={() => navigation.navigate('UpdateProduct', { product })}
        >
          <View>
            <ProductTitle>{product.name}</ProductTitle>
            <InfoRow>
              <Label>Ciclo</Label>
              <Value>{product.cycle_days} dias</Value>
            </InfoRow>
            <InfoRow>
              <Label>Valor unitário:</Label>
              <Value>{formatMoney(product.unit_value)}</Value>
            </InfoRow>
          </View>
          <DeleteButton product={product} />
        </ProductItem>
      ))}
    </Container>
  );
};


const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ProductItem = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.background.paper};
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
`;

const ProductTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.low.main};
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.low.medium};
  margin-right: 4px;
`;

const Value = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.low.medium};
  font-weight: 600;
`;

export default List;
