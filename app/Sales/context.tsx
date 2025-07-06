import { firebaseSale } from '@/infrastructure/firebase/sale';
import GetSaleUseCase from '@/usecases/sale/getAllPaginated';
import GetFarmsProfitUseCase from '@/usecases/sale/getFarmsProfit';
import GetProductProfitUseCase from '@/usecases/sale/getProductProfit';
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
import { SaleProviderProps, SaleProviderType, State } from './types';

const initialState:State = {
  list: [],
  productProfit: [],
  farmsProfit: [],
  lastDoc: undefined,
  hasMore: false,
  loading: true,
};

const Context = createContext({} as SaleProviderType);
const useSaleContext = ():SaleProviderType => useContext(Context);

const SaleProvider = ({ children }: SaleProviderProps) => {
  const initialized = useRef(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const getFarmsProfit = useCallback(async () => {
    try {
      const getUserCase = new GetFarmsProfitUseCase(firebaseSale);
      const data = await getUserCase.execute();

      dispatch({
        type: 'SET_FARMS_PROFIT',
        data,
      });
    } catch {
      Alert.alert(
        'Oops!',
        'Não foi possível carregar os lucros das fazendas. Tente novamente mais tarde.',
      );
    }
  }, []);

  const getProductProfit = useCallback(async () => {
    try {
      const getUserCase = new GetProductProfitUseCase(firebaseSale);
      const data = await getUserCase.execute();

      dispatch({
        type: 'SET_PRODUCT_PROFIT',
        data,
      });
    } catch {
      Alert.alert(
        'Oops!',
        'Não foi possível carregar os lucros dos produtos. Tente novamente mais tarde.',
      );
    }
  }, []);

  const getSale = useCallback(async () => {
    try {
      const getUserCase = new GetSaleUseCase(firebaseSale);
      const data = await getUserCase.execute();
      
      dispatch({
        type: 'SET_SALES',
        ...data,
      });
    } catch {
      Alert.alert(
        'Oops!',
        'Não foi possível carregar as vendas. Tente novamente mais tarde.',
      );
    }
  }, []);

  const getMoreSale = useCallback(async () => {
    if (!state.hasMore || state.loading) return;

    dispatch({ type: 'SET_LOADING', loading: true });

    try {
      const getUserCase = new GetSaleUseCase(firebaseSale);
      const data = await getUserCase.execute(state.lastDoc);

      dispatch({
        type: 'SET_SALES',
        ...data,
      });
    } catch {
      Alert.alert(
        'Oops!',
        'Não foi possível carregar mais vendas. Tente novamente mais tarde.',
      );
    }
  }, [state.hasMore, state.lastDoc, state.loading]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getSale();
      getProductProfit();
      getFarmsProfit();
    }
  }, [getSale, getProductProfit, getFarmsProfit]);

  const value = useMemo(() => ({
    state,
    dispatch,
    getMoreSale,
    getProductProfit,
    getFarmsProfit,
  }), [state, getMoreSale, getFarmsProfit, getProductProfit]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export { SaleProvider, useSaleContext };
