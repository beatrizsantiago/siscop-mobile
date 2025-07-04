import Button from '@/components/Button';
import Input from '@/components/Input';
import { firebaseProduct } from '@/infrastructure/firebase/product';
import AddProductUseCase from '@/usecases/product/addProduct';
import { formatCurrency, stringToFloat, stringToInteger } from '@/utils/format';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert } from 'react-native';
import { styled } from 'styled-components/native';

import { useProductContext } from '../context';

const Add = () => {
  const navigation = useNavigation();

  const { dispatch } = useProductContext();

  const [name, setName] = useState('');
  const [cycleDays, setCycleDays] = useState('');
  const [unitDalue, setUnitValue] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    const formattedCycleDays = stringToInteger(cycleDays);
    const formattedUnitValue = stringToFloat(unitDalue);
    const formattedName = name.trim();

    if (!formattedName || formattedName.length < 3) {
      Alert.alert(
        'Oops!',
        'O nome do produto deve ter pelo menos 3 caracteres.',
      );
      return;
    }

    if (formattedCycleDays <= 0) {
      Alert.alert(
        'Oops!',
        'O ciclo do produto deve ser um valor válido maior que zero.',
      );
      return;
    }

    if (formattedUnitValue <= 0) {
      Alert.alert(
        'Oops!',
        'O valor unitário do produto deve ser um valor válido maior que zero.',
      );
      return;
    }

    setLoading(true);

    try {
      const addProductUseCase = new AddProductUseCase(firebaseProduct);
      const response = await addProductUseCase.execute({
        name,
        cycle_days: formattedCycleDays,
        unit_value: formattedUnitValue,
      });

      dispatch({
        type: 'ADD_PRODUCT',
        item: response,
      });

      navigation.goBack()
    } catch {
      Alert.alert(
        'Oops!',
        'Não foi possível cadastrar o produto. Tente novamente mais tarde.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Novo produto</Title>

      <Input
        label="Nome"
        placeholder="Ex: Produto A"
        value={name}
        onChangeText={setName}
      />
      <Input
        label="Ciclo (em dias)"
        placeholder="Ex: 10"
        keyboardType="numeric"
        value={cycleDays}
        onChangeText={setCycleDays}
      />
      <Input
        label="Preço unitário"
        placeholder="Ex: 10,00"
        keyboardType="numeric"
        value={unitDalue}
        onChangeText={(text) => setUnitValue(formatCurrency(text))}
      />

      <ButtonContainer>
        <Button
          title="Cadastrar"
          onPress={onRegister}
          loading={loading}
          disabled={loading}
        />
      </ButtonContainer>

      <Button
        title="Cancelar"
        onPress={() => navigation.goBack()}
        outlined
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
`;

const ButtonContainer = styled.View`
  margin: 16px 0;
`;

export default Add;
