import Button from '@/components/Button';
import Input from '@/components/Input';
import Product from '@/domain/entities/Product';
import useGetProducts from '@/hooks/useGetProducts';
import { firebaseFarm } from '@/infrastructure/firebase/farm';
import theme from '@/theme';
import UpdaeFarmUseCase from '@/usecases/farm/updateFarm';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Checkbox } from 'expo-checkbox';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal } from 'react-native';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import { styled } from 'styled-components/native';

import Farm from '@/domain/entities/Farm';
import { useFarmContext } from '../context';

type PositionType = {
  latitude: number,
  longitude: number,
};

const Update = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const farmData = route.params?.farm as Farm;

  const { dispatch } = useFarmContext();

  const { products, loading: productsLoading } = useGetProducts();

  const [name, setName] = useState(farmData.name);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<PositionType>({
    latitude: farmData.geolocation._lat,
    longitude: farmData.geolocation._long,
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const isSelected = (id: string) => !!selectedProducts.find((p) => p.id === id);

   const toggleProduct = (item: Product) => {
    setSelectedProducts((prev) => {
      if (prev.find((p) => p.id === item.id)) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedPosition({ latitude, longitude });
  };

  const onRegister = async () => {
    const formattedName = name.trim();

    if (!formattedName || formattedName.length < 3) {
      Alert.alert(
        'Oops!',
        'O nome da fazenda deve ter pelo menos 3 caracteres.',
      );
      return;
    }

    if (selectedProducts.length === 0) {
      Alert.alert(
        'Oops!',
        'Você deve selecionar pelo menos um produto para atualizar a fazenda.',
      );
      return;
    }

    if (!selectedPosition) {
      Alert.alert(
        'Oops!',
        'Você deve selecionar uma posição no mapa para atualizar a fazenda.',
      );
      return;
    }

    setLoading(true);

    try {
      const updateFarmUseCase = new UpdaeFarmUseCase(firebaseFarm);
      const response = await updateFarmUseCase.execute({
        id: farmData.id,
        name,
        geolocation: {
          _lat: selectedPosition.latitude,
          _long: selectedPosition.longitude,
        },
        available_products: selectedProducts.map((p) => p.id),
        detailed_products: [],
      });

      dispatch({
        type: 'UPDATE_FARM',
        item: response,
      });

      navigation.goBack()
    } catch {
      Alert.alert(
        'Oops!',
        'Não foi possível atualizar a fazenda. Tente novamente mais tarde.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      const selected = products.filter((p) =>
        farmData.available_products.includes(p.id),
      );
      setSelectedProducts(selected);
    }
  }, [farmData, products]);

  if (productsLoading) return <ActivityIndicator />;

  return (
    <Container>
      <Title>Nova fazenda</Title>

      <Input
        label="Nome"
        placeholder="Ex: Fazenda A"
        value={name}
        onChangeText={setName}
      />

      <Button
        onPress={() => setModalVisible(true)}
        title="Selecionar produtos"
      />

      {selectedProducts.length > 0 && (
        <SelectedProducts>
          Produtos:
          {' '}
          {selectedProducts.map((p) => p.name).join(', ')}
        </SelectedProducts>
      )}

      <MapContainer
        provider="google"
        initialRegion={{
          latitude: selectedPosition.latitude,
          longitude: selectedPosition.latitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {selectedPosition && (
          <Marker coordinate={selectedPosition} />
        )}
      </MapContainer>

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

      <Modal animationType="slide" transparent visible={modalVisible}>
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>
              Produtos da fazenda
            </ModalTitle>
            <ModalSubtitle>
              Selecione os produtos que pertencem a esta fazenda
            </ModalSubtitle>
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 500, marginBottom: 16 }}
              renderItem={({ item }) => (
                <CheckboxItem
                  onPress={() => toggleProduct(item)}
                >
                  <Checkbox
                    value={isSelected(item.id)}
                    onValueChange={() => toggleProduct(item)}
                    color={theme.primary.main}
                  />
                  <ItemLabel>{item.name}</ItemLabel>
                </CheckboxItem>
              )}
            />

            <Button
              title="Confirmar"
              onPress={() => setModalVisible(false)}
            />
          </ModalContent>
        </ModalOverlay>
      </Modal>
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

const SelectedProducts = styled.Text`
  margin-top: 16px;
  font-size: 16px;
`;

const ButtonContainer = styled.View`
  margin: 16px 0;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: #000000aa;
  justify-content: center;
`;

const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.high.main};
  margin-left: 20px;
  margin-right: 20px;
  padding: 20px;
  border-radius: 10px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

const ModalSubtitle = styled.Text`
  font-size: 16px;
  margin-bottom: 16px;
  text-align: center;
  color: ${({ theme }) => theme.low.medium};
`;

const CheckboxItem = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
`;

const ItemLabel = styled.Text`
  margin-left: 10px;
`;

const MapContainer = styled(MapView)`
  width: 100%;
  height: 300px;
  margin-top: 16px;
`;

export default Update;
