import Button from '@/components/Button';
import Farm from '@/domain/entities/Farm';
import { firebaseFarm } from '@/infrastructure/firebase/farm';
import DeleteFarmUseCase from '@/usecases/farm/deleteFarm';
import { Alert } from 'react-native';

import { useFarmContext } from '../context';

type Props = {
  farm: Farm;
};

const DeleteButton = ({ farm }:Props) => {
  const { dispatch } = useFarmContext();

  const onDeleteClick = async () => {
    try {
      const deleteUseCase = new DeleteFarmUseCase(firebaseFarm);
      await deleteUseCase.execute(farm.id);

      Alert.alert('Sucesso!', 'Fazenda excluída com sucesso!');

      dispatch({
        type: 'DELETE_FARM', id: farm.id,
      });
    } catch (error: any) {
      if ('message' in error && typeof error.message === 'string' && error.message.includes('REFERENCE_ERROR')) {
        Alert.alert(
          'Oops!',
          'Não é possível excluir esta fazenda, pois ela está referenciada em outros registros.',
        );
        return;
      }
      Alert.alert('Oops!', 'Erro ao excluir a fazenda. Tente novamente.');
    }
  };

  const showDeleteAlert = () =>
    Alert.alert(
      'Atenção!',
      `Tem certeza que deseja deletar a fazenda ${farm.name}?`,
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
    <Button
      onPress={showDeleteAlert}
      title="Excluir"
      color="error"
    />
  );
};

export default DeleteButton;
