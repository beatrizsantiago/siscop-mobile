import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Loading from '@/components/Loading';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'styled-components/native';

import { useInventoryContext } from '../context';
import InventoryItem from './InventoryItem';

const List = () => {
  const navigation = useNavigation();

  const { state, getMoreInventory } = useInventoryContext();

  if (state.loading) return <Loading />;

  return (
    <Container>
      <TopRow>
        <IconButton
          iconName="add"
          onPress={() => navigation.navigate('AddInventory')}
        />
      </TopRow>

      {state.list.map((item) => (
        <InventoryItem key={item.id} item={item} />
      ))}

      {state.hasMore && !state.loading && (
        <Button
          title="Carregar mais"
          onPress={() => getMoreInventory()}
          style={{ marginBottom: 24 }}
        />
      )}
    </Container>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
  margin-bottom: 30px;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

export default List;
