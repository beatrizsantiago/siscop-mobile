import { styled } from 'styled-components/native';

import ProductByStateChart from './components/ProductByStateChart';

const Production = () => (
  <Container>
    <ChartContainer>
      <Label>Aguardando plantio</Label>
      <ProductByStateChart state="WAITING" />
    </ChartContainer>
    <ChartContainer>
      <Label>Plantados</Label>
      <ProductByStateChart state="IN_PRODUCTION" />
    </ChartContainer>
    <ChartContainer>
      <Label>Colhidos (Prontos para venda)</Label>
      <ProductByStateChart state="READY" />
    </ChartContainer>
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

export default Production;
