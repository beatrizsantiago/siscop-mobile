import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Loading from '@/components/Loading';
import Farm from '@/domain/entities/Farm';
import theme from '@/theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styled } from 'styled-components/native';

import { useFarmContext } from '../context';
import DeleteButton from './DeleteButton';
import Search from './Search';

const List = () => {
  const navigation = useNavigation();

  const { state } = useFarmContext();

  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setSelectedFarm(null);
    setIsModalVisible(false);
  };

  const center = state.farms[0]?.geolocation || { _lat: 0, _long: 0 };

  if (state.loading) return <Loading />;

  return (
    <Container>
      <TopRow>
        <Search />
        <IconButton
          iconName="add"
          onPress={() => navigation.navigate('AddFarm')}
        />
      </TopRow>
      <MapContainer
        provider="google"
        initialRegion={{
          latitude: center._lat,
          longitude: center._long,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {state.farms.map((farm, idx) => (
          <Marker
            key={idx}
            coordinate={{ latitude: farm.geolocation._lat, longitude: farm.geolocation._long }}
            onPress={() => {
              setSelectedFarm(farm)
              setIsModalVisible(true);
            }}
          />
        ))}
      </MapContainer>
      <Modal
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
        visible={isModalVisible}
      >
        <ModalOverlay>
          <ModalContent>
            <IconTouch onPress={closeModal}>
              <AntDesign name="close" size={24} color={theme.primary.main} />
            </IconTouch>
            <FarmName>
              Fazenda
              {' '}
              {selectedFarm?.name}
            </FarmName>
            <MakerButtonsRow>
              <Button
                title="Editar"
                onPress={() => navigation.navigate('UpdateFarm', { farm: selectedFarm })}
                style={{ width: '48%' }}
              />
              {selectedFarm && (
                <DeleteButton farm={selectedFarm} afterDelete={closeModal} />
              )}
            </MakerButtonsRow>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  width: 100%;
`;

const MapContainer = styled(MapView)`
  width: 100%;
  height: 80%;
  flex: 1;
`;

const FarmName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.primary.main};
  text-align: center;
  margin-top: 16px;
`;

const MakerButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 32px;
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

const IconTouch = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
`;

export default List;
