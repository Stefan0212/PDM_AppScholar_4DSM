import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../hooks/AuthContext';
import api from '../services/api';

export default function VisualizarBoletim() {
  const { user } = useContext(AuthContext);
  const [boletim, setBoletim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBoletim() {
      try {
        const matricula = user?.matricula; 
        
        if (!matricula) {
          Alert.alert('Aviso', 'Matrícula não encontrada. Por favor, faça login novamente.');
          setLoading(false);
          return;
        }

        const response = await api.get(`/boletins/${matricula}`);
        setBoletim(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar o boletim.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchBoletim();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    let color = '#f1c40f'; // Amarelo (Cursando)
    if (item.situacao === 'Aprovado') color = '#2ecc71'; // Verde
    if (item.situacao === 'Reprovado') color = '#e74c3c'; // Vermelho

    return (
      <View style={[styles.card, { borderLeftColor: color }]}>
        <Text style={styles.disciplinaNome}>{item.disciplina}</Text>
        <View style={styles.notasContainer}>
          <Text style={styles.notaTexto}>Nota 1: {item.nota1 !== null ? item.nota1 : '-'}</Text>
          <Text style={styles.notaTexto}>Nota 2: {item.nota2 !== null ? item.nota2 : '-'}</Text>
          <Text style={styles.mediaTexto}>Média: {item.media !== null ? item.media : '-'}</Text>
        </View>
        <Text style={[styles.situacaoTexto, { color }]}>{item.situacao}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Boletim Acadêmico</Text>
      {boletim && <Text style={styles.alunoNome}>Aluno: {boletim.aluno}</Text>}
      
      <FlatList
        data={boletim?.disciplinas || []}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma disciplina encontrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  alunoNome: { fontSize: 16, marginBottom: 16, color: '#555' },
  listContent: { paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 6,
    elevation: 2, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  disciplinaNome: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  notasContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  notaTexto: { fontSize: 14, color: '#666' },
  mediaTexto: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  situacaoTexto: { fontSize: 16, fontWeight: 'bold', textAlign: 'right' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666', fontSize: 16 }
});
