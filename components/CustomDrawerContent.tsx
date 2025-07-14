import theme from '@/theme';
import Octicons from '@expo/vector-icons/Octicons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styled } from 'styled-components/native';

export default function CustomDrawerContent(props: any) {
  const navigation = useNavigation();

  return (
    <DrawerContentScrollView {...props}>
      <TopRow>
        <WelcomeLabel>
          Olá, seja bem-vindo(a)!
        </WelcomeLabel>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Octicons name="bell-fill" size={24} color={theme.primary.main} />
        </TouchableOpacity>
      </TopRow>
      
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const TopRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 8px;
`;

const WelcomeLabel = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.primary.main};
`;
