import Product from '@/domain/entities/Product';
import { firebaseProduct } from '@/infrastructure/firebase/product';
import DeleteProductUseCase from '@/usecases/product/deleteProduct';
import Feather from '@expo/vector-icons/Feather';
import { Alert } from 'react-native';
import { styled } from 'styled-components/native';

import { useProductContext } from '../context';

type Props = {
  product: Product;
};

const DeleteButton = ({ product }:Props) => {
  const { dispatch } = useProductContext();

  const onDeleteClick = async () => {
    try {
      const deleteProductUseCase = new DeleteProductUseCase(firebaseProduct);
      await deleteProductUseCase.execute(product.id);

      Alert.alert('Sucesso!', 'Produto excluído com sucesso!');

      dispatch({
        type: 'DELETE_PRODUCT', id: product.id,
      });
    } catch (error: any) {
      if ('message' in error && typeof error.message === 'string' && error.message.includes('REFERENCE_ERROR')) {
        Alert.alert(
          'Oops!',
          'Não é possível excluir este produto, pois ele está referenciado em outros registros.',
        );
        return;
      }
      Alert.alert('Oops!', 'Erro ao excluir o produto. Tente novamente.');
    }
  };

  const showDeleteAlert = () =>
    Alert.alert(
      'Atenção!',
      `Tem certeza que deseja deletar o produto ${product.name}?`,
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: onDeleteClick,
        },
      ],
      {
        cancelable: true,
      },
    );

  return (
    <Button onPress={showDeleteAlert}>
      <TrashIcon name="trash-2" size={24} />
    </Button>
  );
}

const Button = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const TrashIcon = styled(Feather)`
  color: ${({ theme }) => theme.error.main};
`;

export default DeleteButton;
