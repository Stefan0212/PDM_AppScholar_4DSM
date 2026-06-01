import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../hooks/AuthContext';

export default function ProfessorDashboard({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Professor</Text>
      <Text style={styles.subtitle}>Bem-vindo, {user?.nome}</Text>
      
      <View style={styles.menu}>
        <Button title="Minhas Disciplinas e Alunos" onPress={() => navigation.navigate('MinhasDisciplinas')} />
      </View>

      <Button title="Sair" color="red" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 30, textAlign: 'center', color: '#666' },
  menu: { marginBottom: 40 },
});
