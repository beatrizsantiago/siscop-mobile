import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';

import Styled from './styled';

const MENU_ITEMS = [
  {
    label: 'Produtos',
    screen: 'Products',
    description: 'Administre os produtos: adicione, atualize, consulte ou remova conforme necessário.',
    icon: require('@/assets/images/wheat_sack.png'),
  },
  {
    label: 'Fazendas',
    screen: 'Farms',
    description: 'Gerencie as fazendas cadastradas com facilidade: crie, edite ou exclua registros.',
    icon: require('@/assets/images/field.png'),
  },
  {
    label: 'Estoque',
    screen: 'Inventory',
    description: 'Gestão eficiente do estoque com foco na organização e vendas dos produtos.',
    icon: require('@/assets/images/boxes.png'),
  },
  {
    label: 'Metas',
    screen: 'Goals',
    description: 'Monitoramento das metas estabelecidas, avaliando desempenho e resultados.',
    icon: require('@/assets/images/bar_chart.png'),
  },
  {
    label: 'Vendas',
    screen: 'Sales',
    description: 'Análise completa de vendas, focando nos produtos mais rentáveis e lucrativos.',
    icon: require('@/assets/images/money.png'),
  },
  {
    label: 'Produção',
    screen: 'Production',
    description: 'Acompanhamento das culturas: aguardando plantio, em produção ou já colhidas.',
    icon: require('@/assets/images/tractor.png'),
  },
]

const Dashboard = () => {
  const navigation = useNavigation();

  return (
    <Styled.Container>
      <Styled.Title>Escolha uma área para começar! 😄</Styled.Title>
      {MENU_ITEMS.map((item) => (
        <Styled.MenuItem
          key={item.label}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Styled.IconBox>
            <Image
              source={item.icon}
              style={{ width: 50, height: 50 }}
            />
          </Styled.IconBox>
          <Styled.ContentBox>
            <Styled.Label>{item.label}</Styled.Label>
            <Styled.Description>{item.description}</Styled.Description>
          </Styled.ContentBox>
        </Styled.MenuItem>
      ))}
    </Styled.Container>
  );
};

export default Dashboard;
