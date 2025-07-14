
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import Notification from '@/domain/entities/Notification';
import { firebaseNotification } from '@/infrastructure/firebase/notification';
import theme from '@/theme';
import GetAllPaginatedNotificationUseCase from '@/usecases/notification/getAllPaginated';
import { GOAL_KINDS } from '@/utils/goalKinds';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { formatDate } from 'date-fns';
import { DocumentSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import Styled from './styled';

const Notifications = () => {
  const initialized = useRef(false);
    const navigation = useNavigation();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);

  const getNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const getUserCase = new GetAllPaginatedNotificationUseCase(firebaseNotification);
      const data = await getUserCase.execute();
      setNotifications(data.list);
      setLastDoc(data.lastDoc);
      setHasMore(data.hasMore);
    } catch {
      Alert.alert('Oops!', 'Erro ao carregar as notificações. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getMoreNotifications = async () => {
    if (!hasMore || loading) return;

    setLoading(true);

    try {
      const getUserCase = new GetAllPaginatedNotificationUseCase(firebaseNotification);
      const data = await getUserCase.execute(lastDoc);

      setNotifications((prev) => [...prev, ...data.list]);
      setLastDoc(data.lastDoc);
      setHasMore(data.hasMore);
    } catch {
      Alert.alert('Oops!', 'Erro ao carregar mais metas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getNotifications();
    }
  }, [getNotifications]);

  return (
    <Styled.Container>
      <Styled.HeaderBox>
        <Styled.IconButton onPress={() => navigation.goBack()}>
          <FontAwesome6 name="arrow-left-long" size={24} color={theme.primary.main} />
        </Styled.IconButton>
        <Styled.HeaderTitle>
          Notificações
        </Styled.HeaderTitle>
      </Styled.HeaderBox>

      {notifications.map((notification) => (
        <Styled.NotificationItem key={notification.id}>
          {notification.kind === 'PRODUCTION' ? (
            <FontAwesome6 name="tractor" size={24} color={theme.secondary.main} />
          ) : (
            <FontAwesome6 name="money-bills" size={24} color={theme.tertiary.dark} />
          )}
          <Styled.NotificationContainer>
            <Styled.Title>
              Meta de
              {' '}
              <Styled.Strong>
                {GOAL_KINDS[notification.kind]}
              </Styled.Strong>
              {' '}
              da fazenda
              {' '}
              <Styled.Strong>
                {notification.farm_name}
              </Styled.Strong>
              {' '}
              atingida!
            </Styled.Title>
            <Styled.Date>{formatDate(notification.created_at, "dd/MM/yyyy 'às' HH:mm'h'")}</Styled.Date>
          </Styled.NotificationContainer>
        </Styled.NotificationItem>
      ))}

      {loading && (
        <Loading />
      )}

      {hasMore && !loading && (
        <Button
          title="Carregar mais"
          onPress={getMoreNotifications}
          style={{ marginBottom: 24, marginTop: 24 }}
        />
      )}
    </Styled.Container>
  );
};

export default Notifications;
