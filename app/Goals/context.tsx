import { firebaseGoal } from '@/infrastructure/firebase/goal';
import GetAllGoalsUseCase from '@/usecases/goals/getAllPaginated';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo, useReducer,
  useRef,
} from 'react';
import { Alert } from 'react-native';

import reducer from './reducer';
import { GoalProviderProps, GoalProviderType, State } from './types';

const initialState:State = {
  goals: [],
  lastDoc: undefined,
  hasMore: false,
  loading: true,
};

const Context = createContext({} as GoalProviderType);
const useGoalContext = ():GoalProviderType => useContext(Context);

const GoalProvider = ({ children }: GoalProviderProps) => {
  const initialized = useRef(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const getGoals = useCallback(async () => {
    try {
      const getUserCase = new GetAllGoalsUseCase(firebaseGoal);
      const data = await getUserCase.execute();
      dispatch({
        type: 'SET_GOALS',
        ...data,
      });
    } catch {
      Alert.alert(
        'Oops!',
        'Erro ao carregar as metas. Tente novamente mais tarde.',
      );
    }
  }, []);

  const getMoreGoals = useCallback(async () => {
    if (!state.hasMore || state.loading) return;

    dispatch({ type: 'SET_LOADING', loading: true });

    try {
      const getUserCase = new GetAllGoalsUseCase(firebaseGoal);
      const data = await getUserCase.execute(state.lastDoc);

      dispatch({
        type: 'SET_GOALS',
        ...data,
      });
    } catch {
      Alert.alert(
        'Oops!',
        'Erro ao carregar mais metas. Tente novamente mais tarde.',
      );
    }
  }, [state.hasMore, state.lastDoc, state.loading]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getGoals();
    }
  }, [getGoals]);

  const value = useMemo(() => ({
    state,
    dispatch,
    getMoreGoals,
  }), [state, getMoreGoals]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export { GoalProvider, useGoalContext };

