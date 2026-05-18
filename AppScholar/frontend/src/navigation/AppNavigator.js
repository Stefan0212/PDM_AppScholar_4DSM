import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthContext } from '../hooks/AuthContext';

import LoginScreen from '../screens/LoginScreen';

// Dashboards
import AdminDashboard from '../screens/AdminDashboard';
import ProfessorDashboard from '../screens/ProfessorDashboard';
import AlunoDashboard from '../screens/AlunoDashboard';

// Vamos criar essas telas vazias por enquanto para não quebrar a navegação
import CadastroAluno from '../screens/CadastroAluno';
import CadastroProfessor from '../screens/CadastroProfessor';
import CadastroDisciplina from '../screens/CadastroDisciplina';
import MatriculaAluno from '../screens/MatriculaAluno';
import MinhasDisciplinas from '../screens/MinhasDisciplinas';
import LancamentoNotas from '../screens/LancamentoNotas';
import VisualizarBoletim from '../screens/VisualizarBoletim';

const Stack = createNativeStackNavigator();

function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="CadastroAluno" component={CadastroAluno} options={{ title: 'Novo Aluno' }} />
      <Stack.Screen name="CadastroProfessor" component={CadastroProfessor} options={{ title: 'Novo Professor' }} />
      <Stack.Screen name="CadastroDisciplina" component={CadastroDisciplina} options={{ title: 'Nova Disciplina' }} />
      <Stack.Screen name="MatriculaAluno" component={MatriculaAluno} options={{ title: 'Matrícula' }} /> 
    </Stack.Navigator>
  );
}

function ProfessorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfessorDashboard" component={ProfessorDashboard} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="MinhasDisciplinas" component={MinhasDisciplinas} options={{ title: 'Minhas Turmas' }} />
      <Stack.Screen name="LancamentoNotas" component={LancamentoNotas} options={{ title: 'Lançar Notas' }} />
    </Stack.Navigator>
  );
}

function AlunoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AlunoDashboard" component={AlunoDashboard} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="VisualizarBoletim" component={VisualizarBoletim} options={{ title: 'Boletim' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { signed, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!signed ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : (
        <>
          {user?.perfil === 'admin' && <AdminStack />}
          {user?.perfil === 'professor' && <ProfessorStack />}
          {user?.perfil === 'aluno' && <AlunoStack />}
        </>
      )}
    </NavigationContainer>
  );
}
