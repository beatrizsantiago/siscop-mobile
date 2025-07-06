import { styled } from 'styled-components/native';

import FarmsProfitChart from './FarmsProfitChart';
import List from './List';
import ProductProfitChart from './ProductProfitChart';

const Main = () => (
  <Container>
    <ChartContainer>
      <Label>Lucro por Produto (R$)</Label>
      <ProductProfitChart />
    </ChartContainer>
    <ChartContainer>
      <Label>Lucro por Fazenda (R$)</Label>
      <FarmsProfitChart />
    </ChartContainer>

    <List />
  </Container>
);

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const ChartContainer = styled.View`
  margin-bottom: 16px;
  background-color: ${({ theme }) => theme.high.main};
  width: 100%;
  height: 260px;
  padding: 16px;
  border-radius: 8px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary.main};
  margin-bottom: 16px;
`;

export default Main;
