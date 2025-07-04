import { firebaseProduct } from '@/infrastructure/firebase/product';
import GetAllProductsUseCase from '@/usecases/product/getAllProducts';
import SearchProductsUseCase from '@/usecases/product/searchProductsByName';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { Alert } from 'react-native';
import reducer from './reducer';
import { ProductProviderProps, ProductProviderType, State } from './types';

const initialState:State = {
  products: [],
  loading: true,
};

const Context = createContext({} as ProductProviderType);
const useProductContext = ():ProductProviderType => useContext(Context);

const ProductProvider = ({ children }: ProductProviderProps) => {
  const initialized = useRef(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const getProducts = useCallback(async () => {
    try {
      const getUserCase = new GetAllProductsUseCase(firebaseProduct);
      const products = await getUserCase.execute();
      dispatch({
        type: 'SET_PRODUCTS',
        list: products,
      });
    } catch {
      Alert.alert(
        'Oops!',
        'Não foi possível carregar a lista de produtos. Tente novamente mais tarde.',
      );
    }
  }, []);

  const onSearch = useCallback(async (searchText: string) => {
    try {
      if (!searchText) {
        getProducts();
        return;
      }

      const searchUserCase = new SearchProductsUseCase(firebaseProduct);
      const products = await searchUserCase.execute(searchText);

      dispatch({
        type: 'SET_PRODUCTS',
        list: products,
      });
    } catch {
      Alert.alert(
        'Oops!',
        'Não foi possível pesquisar os produtos. Tente novamente mais tarde.',
      );
    }
  }, [getProducts]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getProducts();
    }
  }, [getProducts]);

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

export { ProductProvider, useProductContext };

