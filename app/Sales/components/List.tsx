import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Loading from '@/components/Loading';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'styled-components/native';

import { useSaleContext } from '../context';
import SaleItem from './SaleItem';

const List = () => {
  const navigation = useNavigation();

  const { state, getMoreSale } = useSaleContext();

  if (state.loading) return <Loading />;

  return (
    <Container>
      <TopRow>
        <Title>
          Últimas vendas
        </Title>
        <IconButton
          iconName="add"
          onPress={() => navigation.navigate('AddSale')}
        />
      </TopRow>

      {state.list.map((item) => (
        <SaleItem key={item.id} item={item} />
      ))}

      {state.hasMore && !state.loading && (
        <Button
          title="Carregar mais"
          onPress={() => getMoreSale()}
          style={{ marginBottom: 24 }}
        />
      )}
    </Container>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  margin-bottom: 30px;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.primary.main};  
`;

export default List;
