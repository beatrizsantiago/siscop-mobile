import { firebaseFarm } from '@/infrastructure/firebase/farm';
import GetAllFarmsUseCase from '@/usecases/farm/getAllFarms';
import SearchFarmsUseCase from '@/usecases/farm/searchFarmsByName';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo, useReducer,
  useRef,
} from 'react';
import { Alert } from 'react-native';

import reducer from './reducer';
import { FarmProviderProps, FarmProviderType, State } from './types';

const initialState:State = {
  farms: [],
  loading: true,
};

const Context = createContext({} as FarmProviderType);
const useFarmContext = ():FarmProviderType => useContext(Context);

const FarmProvider = ({ children }: FarmProviderProps) => {
  const initialized = useRef(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const getFarms = useCallback(async () => {
    try {
      const getUserCase = new GetAllFarmsUseCase(firebaseFarm);
      const farms = await getUserCase.execute();
      dispatch({
        type: 'SET_FARMS',
        list: farms,
      });
    } catch {
      Alert.alert(
        'Oops!',
        'Não foi possível carregar as fazendas. Tente novamente mais tarde.',
      );
    }
  }, []);

  const onSearch = useCallback(async (searchText: string) => {
    try {
      if (!searchText) {
        getFarms();
        return;
      }

      const searchUserCase = new SearchFarmsUseCase(firebaseFarm);
      const farms = await searchUserCase.execute(searchText);

      dispatch({
        type: 'SET_FARMS',
        list: farms,
      });
    } catch {
      Alert.alert(
        'Oops!',
        'Não foi possível pesquisar as fazendas. Tente novamente mais tarde.',
      );
    }
  }, [getFarms]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getFarms();
    }
  }, [getFarms]);

  const value = useMemo(() => ({
    state,
    dispatch,
    onSearch,
  }), [state, onSearch]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export { FarmProvider, useFarmContext };

