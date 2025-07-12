import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import Farm from '@/domain/entities/Farm';
import Product from '@/domain/entities/Product';
import useGetFarms from '@/hooks/useGetFarms';
import { firebaseGoal } from '@/infrastructure/firebase/goal';
import AddGoalUseCase from '@/usecases/goals/addGoal';
import { stringToInteger } from '@/utils/format';
import { KINDS_OPTIONS } from '@/utils/goalKinds';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { styled } from 'styled-components/native';

import { useGoalContext } from '../context';

type ItemType = {
  amount: number;
  product: Product | null
};

const Add = () => {
  const navigation = useNavigation();

  const { dispatch } = useGoalContext();

  const { farms, loading: farmsLoading } = useGetFarms();

  const [loading, setLoading] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [selectedKind, setSelectedKind] = useState('');
  const [itemsList, setItemsList] = useState<ItemType[]>([{
    amount: 0,
    product: null,
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

  const onAddItemClick = () => {
    setItemsList([
      ...itemsList,
      {
        amount: 0,
        product: null,
      },
    ]);
  };

  const onDeleteItemClick = (index: number) => {
    const updatedItemsList = itemsList.filter((_, i) => i !== index);
    setItemsList(updatedItemsList);
  };

  const onSave = async () => {
    if (!selectedFarm) {
      Alert.alert('Atenção!', 'Selecione uma fazenda antes de continuar.');
      return;
    }

    if (!selectedKind) {
      Alert.alert('Atenção!', 'Selecione o tipo da meta antes de continuar.');
      return;
    }

    if (itemsList.some((item) => item.product === null || item.amount <= 0)) {
      Alert.alert('Atenção!', 'Todos os itens devem ter um produto selecionado e uma quantidade maior que zero.');
      return;
    }

    setLoading(true);

    try {
      const addUseCase = new AddGoalUseCase(firebaseGoal);
      const response = await addUseCase.execute({
        kind: selectedKind,
        farm: selectedFarm!,
        items: itemsList.map((item) => ({
          product: item.product!,
          amount: item.amount,
        })),
      });

      dispatch({
        type: 'ADD_GOAL',
        item: response,
      });

      Alert.alert('Sucesso!', 'Meta criada com sucesso!');
      navigation.goBack();
    } catch {
      Alert.alert('Oops!', 'Erro ao criar a meta. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (farmsLoading) return <Loading />;

  return (
    <Container>
      <Title>Nova meta</Title>

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

      <PickerLabel>Tipo</PickerLabel>
      <PickerBox>
        <Picker
          selectedValue={selectedKind}
          onValueChange={(itemValue) => setSelectedKind(itemValue)}
        >
          <Picker.Item label="Selecione..." value="" />
          {KINDS_OPTIONS.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </PickerBox>

      {selectedKind && selectedFarm && itemsList.map((item, index) => (
        <React.Fragment key={index}>
          <LabelsRow>
            <ProductLabel>Produto</ProductLabel>
            <AmountLabel>Quantidade (Kg)</AmountLabel>
          </LabelsRow>

          <ProductRow>
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
              disabled={itemsList.length <= 1}
              onPress={() => onDeleteItemClick(index)}
              color="error"
            />
          </ProductRow>
        </React.Fragment>
      ))}

      {selectedFarm && selectedKind && itemsList.length < selectedFarm.detailed_products.length && (
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
          disabled={loading || !selectedFarm || !selectedKind}
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
  border-radius: 8px;
  background-color: ${({ theme }) => theme.high.main};
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
  margin-left: 18px;
`;

const ProductRow = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ProductPickerBox = styled.View`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.high.main};
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
