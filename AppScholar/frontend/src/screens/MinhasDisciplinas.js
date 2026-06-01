import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../hooks/AuthContext';
import api from '../services/api';

export default function MinhasDisciplinas({ navigation }) {
  const { user } = useContext(AuthContext);
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDisciplinas() {
      try {
        const response = await api.get(`/professores/${user.id}/disciplinas`);
        setTurmas(response.data);
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
      } finally {
        setLoading(false);
      }
    }

    // Usar um listener de foco para atualizar sempre que voltar para esta tela
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDisciplinas();
    });

    return unsubscribe;
  }, [navigation, user.id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('LancamentoNotas', { disciplina: item })}
    >
      <Text style={styles.title}>{item.nome}</Text>
      <Text style={styles.subtitle}>{item.curso} - {item.semestre}º Semestre</Text>
      <Text style={styles.actionText}>Toque para ver os alunos e lançar notas</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={turmas}
        keyExtractor={(item) => String(item.id_disciplina)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma disciplina encontrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  listContent: { paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff'
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 12 },
  actionText: { fontSize: 14, color: '#007bff', fontWeight: 'bold', textAlign: 'right' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666', fontSize: 16 }
});
