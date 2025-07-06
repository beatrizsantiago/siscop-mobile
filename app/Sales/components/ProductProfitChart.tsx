import Loading from '@/components/Loading';
import theme from '@/theme';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { styled } from 'styled-components/native';

import { useSaleContext } from '../context';

const screenWidth = Dimensions.get('window').width;

const ProductProfitChart = () => {
  const { state } = useSaleContext();

  if (state.loading) return <Loading />;

  if(state.productProfit.length === 0) {
    return (
      <EmptyLabel>
        Ainda não há dados disponíveis para este gráfico.
      </EmptyLabel>
    );
  };

  const BAR_DATA = state.productProfit.map((item) => ({
    value: item.profit,
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

export default ProductProfitChart;
