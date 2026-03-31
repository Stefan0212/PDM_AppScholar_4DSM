// src/navigation/types.ts
import { NavigatorScreenParams } from '@react-navigation/native';

// Tipagem das abas inferiores
export type TabParamList = {
  Dashboard: undefined;
  Alunos: undefined;
  Professores: undefined;
  Disciplinas: undefined;
  Boletim: undefined;
};

// Tipagem da pilha principal (Stack)
export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
};