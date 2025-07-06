import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import Farm from '@/domain/entities/Farm';
import Inventory from '@/domain/entities/Inventory';
import useGetFarms from '@/hooks/useGetFarms';
import { stringToInteger } from '@/utils/format';
import { INVENTORY_STATE_OPTIONS } from '@/utils/inventoryStateList';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { styled } from 'styled-components/native';

import { firebaseInventory } from '@/infrastructure/firebase/inventory';
import { firebaseKardex } from '@/infrastructure/firebase/kardex';
import AddInventoryUseCase from '@/usecases/inventory/add';
import { Alert } from 'react-native';
import { useInventoryContext } from '../context';

const Add = () => {
  const navigation = useNavigation();

  const { dispatch } = useInventoryContext();

  const { farms, loading: farmsLoading } = useGetFarms();

  const [loading, setLoading] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [selectedState, setSelectedState] = useState('');
  const [productsList, setProductsList] = useState<Inventory['items']>([{
    product: {
      id: '',
      name: '',
      unit_value: 0,
      cycle_days: 0,
    },
    amount: 0,
  }]);

  const lastProduct = productsList[productsList.length - 1];

  const handleSelectProduct = (index: number, productId: string | null) => {
    const updatedProductsList = [...productsList];

    if (!productId) {
      updatedProductsList[index].product = {
        id: '',
        name: '',
        unit_value: 0,
        cycle_days: 0,
      };
      setProductsList(updatedProductsList);
      return;
    }

    updatedProductsList[index].product = selectedFarm?.detailed_products.find((item) => item.id === productId)!;
    setProductsList(updatedProductsList);
  };

  const handleAmountChange = (index: number, amount: string) => {
    const updatedProductsList = [...productsList];
    updatedProductsList[index].amount = stringToInteger(amount);
    setProductsList(updatedProductsList);
  };

  const onAddProductClick = () => {
    setProductsList([
      ...productsList,
      {
        product: {
          id: '',
          name: '',
          unit_value: 0,
          cycle_days: 0,
        },
        amount: 0,
      },
    ]);
  };

  const onDeleteProductClick = (index: number) => {
    const updatedProductsList = productsList.filter((_, i) => i !== index);
    setProductsList(updatedProductsList);
  };

  const onSave = async () => {
    if (!selectedFarm) {
      Alert.alert('Atenção!', 'Selecione uma fazenda antes de continuar.');
      return;
    }

    if (!selectedState) {
      Alert.alert('Atenção!', 'Selecione um estado antes de continuar.');
      return;
    }

    if (productsList.some((item) => item.product.id === '' || item.amount <= 0)) {
      Alert.alert('Atenção!', 'Todos os produtos devem ser selecionados e ter uma quantidade maior que zero.');
      return;
    }

    setLoading(true);

    try {
      const addInventoryUseCase = new AddInventoryUseCase(firebaseInventory, firebaseKardex);
      const response = await addInventoryUseCase.execute({
        farm: selectedFarm!,
        items: productsList,
        state: selectedState,
      });

      dispatch({
        type: 'ADD_INVENTORY',
        item: response,
      });

      Alert.alert('Sucesso!', 'Estoque adicionado com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      if ('message' in error && typeof error.message === 'string' && error.message.includes('INSUFFICIENT_STOCK')) {
        const productName = error.message.split(':')[1];
        Alert.alert(
          'Estoque insuficiente',
          `O estoque do produto ${productName} na fazenda ${selectedFarm?.name} é insuficiente para o lançamento.`,
        );
        return;
      }

      Alert.alert('Oops', 'Ocorreu um erro ao adicionar o estoque. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (farmsLoading) return <Loading />;

  return (
    <Container>
      <Title>Novo lançamento</Title>

      <PickerBox>
        <PickerLabel>Fazenda</PickerLabel>
        <Picker
          selectedValue={selectedFarm?.id || ''}
          onValueChange={(farmId) => {
            const farm = farms.find(f => f.id === farmId);
            setSelectedFarm(farm ?? null);
          }}
        >
          <Picker.Item label="Selecione..." value={null} />
          {farms.map((item) => (
            <Picker.Item key={item.id} label={item.name} value={item.id} />
          ))}
        </Picker>
      </PickerBox>

      {selectedFarm && (
        <PickerBox>
          <PickerLabel>Estado</PickerLabel>
          <Picker
            selectedValue={selectedState}
            onValueChange={(itemValue) => setSelectedState(itemValue)}
          >
            <Picker.Item label="Selecione..." value="" />
            {INVENTORY_STATE_OPTIONS.map((item) => (
              <Picker.Item key={item.value} label={item.label} value={item.value} />
            ))}
          </Picker>
        </PickerBox>
      )}

      {selectedFarm && productsList.map((item, index) => (
        <React.Fragment key={index}>
          <LabelsRow>
            <ProductLabel>Produto</ProductLabel>
            <AmountLabel>Quantidade</AmountLabel>
          </LabelsRow>

          <ProductRow>
            <ProductPickerBox>
              <Picker
                selectedValue={item.product.id || productsList[index].product.id}
                onValueChange={(itemValue) => handleSelectProduct(index, itemValue)}
              >
                <Picker.Item label="Selecione..." value="" />
                {selectedFarm.detailed_products.map((item) => (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.id}
                    enabled={!productsList.some((p) => p.product.id === item.id)}
                  />
                ))}
              </Picker>
            </ProductPickerBox>

            <AmountBox>
              <Input
                placeholder="Ex: 10"
                keyboardType="numeric"
                withoutMargin
                value={item.amount.toString()}
                onChangeText={(text) => handleAmountChange(index, text)}
              />
            </AmountBox>

            <IconButton
              iconName="delete-outline"
              disabled={productsList.length <= 1}
              onPress={() => onDeleteProductClick(index)}
              color="error"
            />
          </ProductRow>
        </React.Fragment>
      ))}

      {selectedFarm && productsList.length < selectedFarm.detailed_products.length && (
        <Button
          title="Adicionar produto"
          onPress={onAddProductClick}
          color="secondary"
          disabled={lastProduct && (lastProduct.product.id === '' || lastProduct.amount <= 0)}
        />
      )}

      <ButtonContainer>
        <Button
          title="Salvar"
          onPress={onSave}
          loading={loading}
          disabled={loading || !selectedFarm || !selectedState}
        />
      </ButtonContainer>

      <Button
        title="Cancelar"
        onPress={() => navigation.goBack()}
        outlined
      />
    </Container>
  );
}

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
`;

const PickerLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.primary.main};
  font-weight: 500;
`;

const PickerBox = styled.View`
  border-bottom-width: 1.5px;
  border-bottom-color: ${({ theme }) => theme.primary.main};
  margin-bottom: 24px;
`;

const LabelsRow = styled.View`
  flex-direction: row;
`;

const ProductLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.primary.main};
  font-weight: 500;
  width: 50%;
`;

const AmountLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.primary.main};
  font-weight: 500;
  width: 30%;
`;

const ProductRow = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ProductPickerBox = styled.View`
  border-bottom-width: 1.5px;
  border-bottom-color: ${({ theme }) => theme.primary.main};
  width: 100%;
  max-width: 50%;
`;

const AmountBox = styled.View`
  width: 100%;
  max-width: 30%;
`;

const ButtonContainer = styled.View`
  margin-top: 48px;
  margin-bottom: 16px;
`;

export default Add;
