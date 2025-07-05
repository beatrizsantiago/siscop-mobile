import { firebaseInventory } from '@/infrastructure/firebase/inventory';
import GetInventoryUseCase from '@/usecases/inventory/getAllPaginated';
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
import { InventoryProviderProps, InventoryProviderType, State } from './types';

const initialState:State = {
  list: [],
  lastDoc: undefined,
  hasMore: false,
  loading: true,
};

const Context = createContext({} as InventoryProviderType);
const useInventoryContext = ():InventoryProviderType => useContext(Context);

const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const initialized = useRef(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const getInventory = useCallback(async () => {
    try {
      const getUserCase = new GetInventoryUseCase(firebaseInventory);
      const data = await getUserCase.execute();
      
      dispatch({
        type: 'SET_INVENTORY',
        ...data,
      });
    } catch {
      Alert.alert('Oops!', 'Erro ao carregar o estoque. Tente novamente mais tarde.');
    }
  }, []);

  const getMoreInventory = useCallback(async () => {
    if (!state.hasMore || state.loading) return;

    dispatch({ type: 'SET_LOADING', loading: true });

    try {
      const getUserCase = new GetInventoryUseCase(firebaseInventory);
      const data = await getUserCase.execute(state.lastDoc);

      dispatch({
        type: 'SET_INVENTORY',
        ...data,
      });
    } catch {
      Alert.alert('Oops!', 'Erro ao carregar mais itens do estoque. Tente novamente mais tarde.');
    }
  }, [state.hasMore, state.lastDoc, state.loading]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getInventory();
    }
  }, [getInventory]);

  const value = useMemo(() => ({
    state,
    dispatch,
    getMoreInventory,
  }), [state, getMoreInventory]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export { InventoryProvider, useInventoryContext };
