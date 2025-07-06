import Goal from '@/domain/entities/Goal';
import { firebaseGoal } from '@/infrastructure/firebase/goal';
import DeleteGoalUseCase from '@/usecases/goals/deleteGoal';
import { GOAL_KINDS } from '@/utils/goalKinds';
import Feather from '@expo/vector-icons/Feather';
import { Alert } from 'react-native';
import { styled } from 'styled-components/native';

import { useGoalContext } from '../context';

type Props = {
  goal: Goal;
};

const DeleteButton = ({ goal }:Props) => {
  const { dispatch } = useGoalContext();

  const onDeleteClick = async () => {
    try {
      const deleteGoalUseCase = new DeleteGoalUseCase(firebaseGoal);
      await deleteGoalUseCase.execute(goal.id);

      Alert.alert('Sucesso!', 'Meta excluída com sucesso!');

      dispatch({
        type: 'DELETE_GOAL', id: goal.id,
      });
    } catch {
      Alert.alert('Oops!', 'Erro ao excluir a meta. Tente novamente.');
    }
  };

  const showDeleteAlert = () =>
    Alert.alert(
      'Atenção!',
      `Tem certeza que deseja deletar a meta de ${GOAL_KINDS[goal.kind]} da fazenda ${goal.farm.name}?`,
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
  top: -2px;
  right: -8px;
`;

const TrashIcon = styled(Feather)`
  color: ${({ theme }) => theme.error.main};
`;

export default DeleteButton;
