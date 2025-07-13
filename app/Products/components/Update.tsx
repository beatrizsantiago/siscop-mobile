import Button from '@/components/Button';
import Input from '@/components/Input';
import Product from '@/domain/entities/Product';
import { firebaseProduct } from '@/infrastructure/firebase/product';
import UpdateProductUseCase from '@/usecases/product/updateProduct';
import { floatToCurrency, formatCurrency, stringToFloat, stringToInteger } from '@/utils/format';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Alert } from 'react-native';
import { styled } from 'styled-components/native';

import { useProductContext } from '../context';

const Update = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const productData = route.params?.product as Product;

  const { dispatch } = useProductContext();

  const [name, setName] = useState(productData.name);
  const [cycleDays, setCycleDays] = useState(productData.cycle_days.toString());
  const [unitDalue, setUnitValue] = useState(floatToCurrency(productData.unit_value));
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
      const updateProductUseCase = new UpdateProductUseCase(firebaseProduct);
      const response = await updateProductUseCase.execute({
        id: productData.id,
        name: formattedName,
        cycle_days: formattedCycleDays,
        unit_value: formattedUnitValue,
      });

      dispatch({
        type: 'UPDATE_PRODUCT',
        item: response,
      });

      navigation.goBack()
    } catch {
      Alert.alert(
        'Oops!',
        'Ocorreu um erro ao atualizar o produto. Tente novamente mais tarde.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>
        Atualizar
        {' '}
        {productData.name}
      </Title>

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
          title="Salvar"
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

export default Update;
