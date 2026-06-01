import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { PrimaryButton } from '../components/PrimaryButton';
import api from '../services/api';

export default function LancamentoNotas({ route }) {
  const { disciplina } = route.params;

  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');

  const carregarAlunos = async () => {
    try {
      const response = await api.get(`/disciplinas/${disciplina.id_disciplina}/alunos`);
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de alunos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  const abrirModal = (aluno) => {
    setAlunoSelecionado(aluno);
    setNota1(aluno.nota1 !== null ? String(aluno.nota1) : '');
    setNota2(aluno.nota2 !== null ? String(aluno.nota2) : '');
    setModalVisible(true);
  };

  const salvarNotas = async () => {
    setLoadingSubmit(true);
    try {
      await api.put(`/boletins/nota/${alunoSelecionado.id_nota}`, { nota1, nota2 });
      
      Alert.alert('Sucesso', 'Notas salvas com sucesso!');
      
      // Recarrega a lista do backend para obter a média atualizada pelo servidor
      await carregarAlunos();
      setModalVisible(false);
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar as notas.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const renderItem = ({ item }) => {
    let statusColor = '#f1c40f'; // Amarelo (Cursando)
    if (item.situacao === 'Aprovado') statusColor = '#2ecc71'; // Verde
    if (item.situacao === 'Reprovado') statusColor = '#e74c3c'; // Vermelho

    return (
      <View style={[styles.card, { borderLeftColor: statusColor }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.alunoNome}>{item.aluno_nome}</Text>
          <Text style={styles.matricula}>RA: {item.matricula}</Text>
          <Text style={styles.notasLabel}>
            N1: {item.nota1 ?? '-'} | N2: {item.nota2 ?? '-'} | Média: {item.media ?? '-'}
          </Text>
          <Text style={[styles.situacao, { color: statusColor }]}>{item.situacao}</Text>
        </View>
        <TouchableOpacity style={styles.btnLancar} onPress={() => abrirModal(item)}>
          <Text style={styles.btnText}>Lançar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{disciplina.nome}</Text>
      <Text style={styles.subtitle}>Selecione um aluno para lançar a nota</Text>

      <FlatList
        data={alunos}
        keyExtractor={(item) => String(item.id_nota)}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum aluno matriculado.</Text>}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lançar Notas</Text>
            <Text style={{ marginBottom: 15 }}>Aluno: {alunoSelecionado?.aluno_nome}</Text>
            
            <CustomInput label="Nota 1" keyboardType="numeric" value={nota1} onChangeText={setNota1} />
            <CustomInput label="Nota 2" keyboardType="numeric" value={nota2} onChangeText={setNota2} />

            <PrimaryButton title="Salvar Notas" onPress={salvarNotas} loading={loadingSubmit} />
            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)} disabled={loadingSubmit}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2, borderLeftWidth: 5 },
  alunoNome: { fontSize: 16, fontWeight: 'bold' },
  matricula: { fontSize: 12, color: '#666' },
  notasLabel: { fontSize: 14, color: '#333', marginTop: 4 },
  situacao: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  btnLancar: { backgroundColor: '#007bff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginLeft: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  btnCancelar: { marginTop: 15, alignItems: 'center' },
  btnCancelarText: { color: '#e74c3c', fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666', fontSize: 16 }
});
