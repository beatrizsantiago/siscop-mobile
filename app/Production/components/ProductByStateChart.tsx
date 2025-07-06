import Loading from '@/components/Loading';
import { firebaseKardex } from '@/infrastructure/firebase/kardex';
import theme from '@/theme';
import { ProducsByStateDataType } from '@/types/chart';
import GetDataUseCase from '@/usecases/kardex/getProductsByState';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { styled } from 'styled-components/native';

type Props = {
  state: string;
};

const screenWidth = Dimensions.get('window').width;

const ProductByStateChart = ({ state }:Props) => {
  const [chartData, setChartData] = useState<ProducsByStateDataType>([]);
  const [loading, setLoading] = useState(false);

  const getChartData = useCallback(async () => {
    setLoading(true);
    try {
      const getUserCase = new GetDataUseCase(firebaseKardex);
      const data = await getUserCase.execute(state);
      setChartData(data);
    } catch {
      Alert.alert(
        'Oops!',
        'Não foi possível buscar os dados do gráfico. Tente novamente mais tarde.',
      );
    } finally {
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {
    getChartData();
  }, [getChartData]);

  if (loading) return <Loading />;

  if(chartData.length === 0) {
    return (
      <EmptyLabel>
        Não há dados disponíveis para este estado.
      </EmptyLabel>
    );
  };

  const BAR_DATA = chartData.map((item) => ({
    value: item.amount,
    label: item.productName,
  }));

  return (
    <BarChart
      showYAxisIndices
      noOfSections={6}
      data={BAR_DATA}
      isAnimated
      width={screenWidth - 125}
      height={160}
      frontColor={theme.secondary.light}
      nestedScrollEnabled
    />
  );
};

const EmptyLabel = styled.Text`
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
`;

export default ProductByStateChart;
