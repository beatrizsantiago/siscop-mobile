import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import Farm from '@/domain/entities/Farm';
import Product from '@/domain/entities/Product';
import useGetFarms from '@/hooks/useGetFarms';
import { firebaseKardex } from '@/infrastructure/firebase/kardex';
import { firebaseSale } from '@/infrastructure/firebase/sale';
import AddSaleUseCase from '@/usecases/sale/add';
import { stringToFloat, stringToInteger } from '@/utils/format';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { styled } from 'styled-components/native';

import { useSaleContext } from '../context';

type ItemType = {
  amount: number;
  product: Product | null
  unit_value: number;
  value: string;
};

const Add = () => {
  const navigation = useNavigation();

  const { dispatch, getProductProfit, getFarmsProfit } = useSaleContext();

  const { farms, loading: farmsLoading } = useGetFarms();

  const [loading, setLoading] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [itemsList, setItemsList] = useState<ItemType[]>([{
    amount: 0,
    product: null,
    unit_value: 0,
    value: '',
  }]);

  const lastItem = itemsList[itemsList.length - 1];

  const handleSelectProduct = (index: number, productId: string | null) => {
    const updatedItemsList = [...itemsList];

    if (!productId) {
      updatedItemsList[index].product = {
        id: '',
        name: '',
        unit_value: 0,
        cycle_days: 0,
      };
      setItemsList(updatedItemsList);
      return;
    }

    updatedItemsList[index].product = selectedFarm?.detailed_products.find((item) => item.id === productId)!;
    setItemsList(updatedItemsList);
  };

  const handleAmountChange = (index: number, amount: string) => {
    const updatedItemsList = [...itemsList];
    updatedItemsList[index].amount = stringToInteger(amount);
    setItemsList(updatedItemsList);
  };

  const handleUnitValueChange = (index: number, unitValue: string) => {
    const updatedItemsList = [...itemsList];
    updatedItemsList[index].unit_value = stringToFloat(unitValue);
    updatedItemsList[index].value = unitValue;
    setItemsList(updatedItemsList);
  };

  const onAddItemClick = () => {
    setItemsList([
      ...itemsList,
      {
        amount: 0,
        product: null,
        unit_value: 0,
        value: '',
      },
    ]);
  };

  const onDeleteItemClick = (index: number) => {
    const updatedItemsList = itemsList.filter((_, i) => i !== index);
    setItemsList(updatedItemsList);
  };

  const onSave = async () => {
    if (!selectedFarm) {
      Alert.alert(
        'Atenção!',
        'Selecione uma fazenda para registrar a venda.',
      );
      return;
    }

    if (itemsList.some((item) => item.product === null || item.amount <= 0 || item.unit_value <= 0)) {
      Alert.alert(
        'Atenção!',
        'Todos os produtos devem ser selecionados e ter uma quantidade e valor maior que zero.',
      );
      return;
    }

    setLoading(true);

    try {
      const addUseCase = new AddSaleUseCase(firebaseSale, firebaseKardex);
      const response = await addUseCase.execute({
        items: itemsList
          .map((item) => ({
            amount: item.amount,
            product: item.product as Product,
            unit_value: item.unit_value,
          })),
        farm: selectedFarm as Farm,
      });

      dispatch({
        type: 'ADD_SALE',
        item: response,
      });

      Alert.alert(
        'Venda realizada com sucesso',
        `A venda foi registrada com sucesso na fazenda ${selectedFarm?.name}.`,
      );
      getProductProfit();
      getFarmsProfit();

      navigation.goBack()
    } catch (error: any) {
      if ('message' in error && typeof error.message === 'string' && error.message.includes('INSUFFICIENT_STOCK')) {
        const productName = error.message.split(':')[1];
        Alert.alert(
          'Estoque insuficiente',
          `O estoque do produto ${productName} é insuficiente para realizar a venda.`,
        );
        return;
      }

      Alert.alert(
        'Oops!',
        'Não foi possível realizar a venda. Tente novamente mais tarde.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (farmsLoading) return <Loading />;

  return (
    <Container>
      <Title>Nova venda</Title>

      <PickerLabel>Fazenda</PickerLabel>
      <PickerBox>
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

      {selectedFarm && selectedFarm.detailed_products.length === 0 && (
        <EmptyProductsLabel>
          Não há produtos prontos para venda nesta fazenda.
        </EmptyProductsLabel>
      )}

      {selectedFarm && itemsList.map((item, index) => (
        <ItemRow key={index}>
          <ItemBox>
            <ProductLabel>Produto</ProductLabel>
            <ProductPickerBox>
              <Picker
                selectedValue={item.product?.id || itemsList[index].product?.id}
                onValueChange={(itemValue) => handleSelectProduct(index, itemValue)}
              >
                <Picker.Item label="Selecione..." value="" />
                {selectedFarm.detailed_products.map((item) => (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.id}
                    enabled={!itemsList.some((p) => p.product?.id === item.id)}
                  />
                ))}
              </Picker>
            </ProductPickerBox>

            <FieldsRow>
              <FieldBox>
                <Input
                  label="Quantidade"
                  placeholder="Ex: 10"
                  keyboardType="numeric"
                  withoutMargin
                  value={item.amount.toString()}
                  onChangeText={(text) => handleAmountChange(index, text)}
                />
              </FieldBox>
              <FieldBox>
                <Input
                  label="Preço unitário"
                  placeholder="Ex: 10,00"
                  keyboardType="numeric"
                  value={item.value}
                  onChangeText={(text) => handleUnitValueChange(index, text)}
                />
              </FieldBox>
            </FieldsRow>
          </ItemBox>
          <IconButton
            iconName="delete-outline"
            onPress={() => onDeleteItemClick(index)}
            disabled={itemsList.length === 1}
            color="error"
          />
        </ItemRow>
      ))}

      {selectedFarm && itemsList.length < selectedFarm.detailed_products.length && (
        <Button
          title="Adicionar item"
          onPress={onAddItemClick}
          color="secondary"
          disabled={lastItem && (lastItem.product?.id === '' || lastItem.amount <= 0)}
        />
      )}

      <ButtonContainer>
        <Button
          title="Salvar"
          onPress={onSave}
          loading={loading}
          disabled={loading || !selectedFarm}
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

const ItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const ItemBox = styled.View`
  flex: 1;
  margin-right: 16px;
`;

const PickerLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.primary.main};
  font-weight: 500;
`;

const PickerBox = styled.View`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.high.main};
  margin-bottom: 24px;
`;

const ProductLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.primary.main};
  font-weight: 500;
  width: 50%;
`;

const ProductPickerBox = styled.View`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.high.main};
  width: 100%;
  margin-bottom: 16px;
`;
const ButtonContainer = styled.View`
  margin-top: 40px;
  margin-bottom: 16px;
`;

const EmptyProductsLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.low.main};
  font-weight: 500;
  text-align: center;
  margin-top: 16px;
`;

const FieldsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const FieldBox = styled.View`
  width: 48%;
`;

export default Add;
