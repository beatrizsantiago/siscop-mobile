import Farm from '@/domain/entities/Farm';
import { firebaseFarm } from '@/infrastructure/firebase/farm';
import GetFarmsUseCase from '@/usecases/farm/getAllWithDetailedProducts';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

const useGetFarms = () => {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(false);

  const getFarms = useCallback(async () => {
    setLoading(true);
    try {
      const getUserCase = new GetFarmsUseCase(firebaseFarm);
      const list = await getUserCase.execute();
      setFarms(list);
    } catch {
      Alert.alert(
        'Oops!',
        'Não foi possível carregar as fazendas. Por favor, tente novamente mais tarde.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getFarms();
  }, [getFarms]);

  return {
    farms,
    loading,
  };
}

export default useGetFarms;
