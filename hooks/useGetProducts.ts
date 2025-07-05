import Product from '@/domain/entities/Product';
import { firebaseProduct } from '@/infrastructure/firebase/product';
import GetAllProductsUseCase from '@/usecases/product/getAllProducts';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

const useGetProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false);

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const getUserCase = new GetAllProductsUseCase(firebaseProduct);
      const products = await getUserCase.execute();
      setProducts(products);
    } catch {
      Alert.alert(
        'Oops!',
        'Não foi possível carregar a lista de produtos. Tente novamente mais tarde.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return {
    products,
    loading,
  };
}

export default useGetProducts;
