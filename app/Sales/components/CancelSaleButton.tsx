import Button from '@/components/Button';
import Sale from '@/domain/entities/Sale';
import { firebaseKardex } from '@/infrastructure/firebase/kardex';
import { firebaseSale } from '@/infrastructure/firebase/sale';
import CalcelSaleUseCase from '@/usecases/sale/cancel';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useSaleContext } from '../context';

type Props = {
  sale: Sale,
};

const CancelSaleButton = ({ sale }:Props) => {
  const { dispatch, getProductProfit, getFarmsProfit } = useSaleContext();

  const [loading, setLoading] = useState(false);

  const handleCancelSale = async () => {
    setLoading(true);

    try {
      const cancelUseCase = new CalcelSaleUseCase(firebaseSale, firebaseKardex);
      await cancelUseCase.execute(sale.id);

      dispatch({
        type: 'CANCEL_SALE',
        id: sale.id,
      });

      Alert.alert(
        'Venda cancelada',
        `A venda de ${sale.farm.name} foi cancelada com sucesso.`,
      );

      getProductProfit();
      getFarmsProfit();
    } catch {
      Alert.alert(
        'Oops!',
        'Ocorreu um erro ao tentar cancelar a venda. Por favor, tente novamente mais tarde.',
      );
    } finally {
      setLoading(false);
    }
  };

  const showDeleteAlert = () =>
    Alert.alert(
      'Atenção!',
      `Tem certeza que deseja cancelar a venda de ${sale.farm.name}?`,
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: handleCancelSale,
        },
      ],
      {
        cancelable: true,
      },
    );

  return (
    <Button
      color="error"
      onPress={showDeleteAlert}
      loading={loading}
      disabled={loading}
      title="Cancelar venda"
    />
  );
};

export default CancelSaleButton;
