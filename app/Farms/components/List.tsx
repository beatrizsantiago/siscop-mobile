import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import { useNavigation } from '@react-navigation/native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { styled } from 'styled-components/native';

import { useFarmContext } from '../context';
import DeleteButton from './DeleteButton';
import Search from './Search';

const List = () => {
  const navigation = useNavigation();

  const { state } = useFarmContext();

  const center = state.farms[0]?.geolocation || { _lat: 0, _long: 0 };

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
          >
            <Callout tooltip>
              <FarmInfo>
                <FarmName>{farm.name}</FarmName>
                <MakerButtonsRow>
                  <Button title="Editar" onPress={() => navigation.navigate('UpdateFarm', { farm })} />
                  <DeleteButton farm={farm} />
                </MakerButtonsRow>
              </FarmInfo>
            </Callout>
          </Marker>
        ))}
      </MapContainer>
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

const FarmInfo = styled.View`
  width: 300px;
  height: 100px;
  background-color: ${({ theme }) => theme.high.main};
  border-radius: 10px;
  padding: 10px;
`;

const FarmName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.primary.main};
`;

const MakerButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  width: 100%;
`;



export default List;
