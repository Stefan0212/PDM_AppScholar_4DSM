import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../components/CustomInput';
import { PrimaryButton } from '../components/PrimaryButton';
import api from '../services/api';
import { colors, cardShadow, shadow } from '../styles/theme';

export default function LancamentoNotas({ route }) {
  const { disciplina } = route.params;

  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [errors, setErrors] = useState({});

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
    setNota1(aluno.nota1 !== null && aluno.nota1 !== undefined ? String(aluno.nota1) : '');
    setNota2(aluno.nota2 !== null && aluno.nota2 !== undefined ? String(aluno.nota2) : '');
    setErrors({});
    setModalVisible(true);
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const validateNotes = () => {
    let valid = true;
    let newErrors = {};

    const checkNote = (value, field) => {
      if (value === '') return; // Vazio é válido (representa sem nota lançada ainda)
      
      // Substituir vírgula por ponto para validação e conversão
      const normalizedVal = value.replace(',', '.');
      const num = parseFloat(normalizedVal);
      
      if (isNaN(num)) {
        newErrors[field] = 'A nota deve ser um número.';
        valid = false;
      } else if (num < 0 || num > 10) {
        newErrors[field] = 'A nota deve estar entre 0 e 10.';
        valid = false;
      }
    };

    checkNote(nota1, 'nota1');
    checkNote(nota2, 'nota2');

    setErrors(newErrors);
    return valid;
  };

  const salvarNotas = async () => {
    if (!validateNotes()) {
      return;
    }

    setLoadingSubmit(true);
    try {
      // Normaliza vírgulas para pontos antes de enviar
      const n1 = nota1 === '' ? '' : nota1.replace(',', '.');
      const n2 = nota2 === '' ? '' : nota2.replace(',', '.');

      await api.put(`/boletins/nota/${alunoSelecionado.id_nota}`, { 
        nota1: n1, 
        nota2: n2 
      });
      
      Alert.alert('Sucesso', 'Notas salvas e média recalculada com sucesso!');
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
    let statusColor = colors.warning; // Amarelo (Cursando)
    let statusBg = colors.warningLight;
    
    if (item.situacao === 'Aprovado') {
      statusColor = colors.success; // Verde
      statusBg = colors.successLight;
    } else if (item.situacao === 'Reprovado') {
      statusColor = colors.danger; // Vermelho
      statusBg = colors.dangerLight;
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <View style={styles.studentAvatar}>
            <Text style={styles.avatarText}>{getInitials(item.aluno_nome)}</Text>
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.alunoNome}>{item.aluno_nome}</Text>
            <Text style={styles.matricula}>RA: {item.matricula}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.scoresRow}>
          <View style={styles.scoreBlock}>
            <Text style={styles.scoreLabel}>Nota 1</Text>
            <Text style={styles.scoreVal}>{item.nota1 ?? '-'}</Text>
          </View>
          <View style={styles.scoreBlock}>
            <Text style={styles.scoreLabel}>Nota 2</Text>
            <Text style={styles.scoreVal}>{item.nota2 ?? '-'}</Text>
          </View>
          <View style={styles.scoreBlock}>
            <Text style={[styles.scoreLabel, { fontWeight: '700' }]}>Média</Text>
            <Text style={[styles.scoreVal, { fontWeight: '700', color: colors.textDark }]}>
              {item.media ?? '-'}
            </Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{item.situacao}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.btnLancar} onPress={() => abrirModal(item)}>
          <Ionicons name="create-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.btnText}>Lançar Notas</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={alunos}
        keyExtractor={(item) => String(item.id_nota)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.headerTitle}>{disciplina.nome}</Text>
            <Text style={styles.subtitle}>Listagem de alunos vinculados. Toque em lançar para atribuir as notas bimestrais.</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyText}>Nenhum aluno matriculado nesta disciplina.</Text>
          </View>
        }
      />

      <Modal 
        visible={modalVisible} 
        transparent 
        animationType="fade"
        onRequestClose={() => {
          if (!loadingSubmit) setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lançamento Acadêmico</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)} 
                disabled={loadingSubmit}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <View style={styles.studentInfoBadge}>
              <View style={styles.miniAvatar}>
                <Text style={styles.miniAvatarText}>{getInitials(alunoSelecionado?.aluno_nome)}</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.modalStudentName}>{alunoSelecionado?.aluno_nome}</Text>
                <Text style={styles.modalStudentRa}>RA: {alunoSelecionado?.matricula}</Text>
              </View>
            </View>

            <View style={styles.modalForm}>
              <CustomInput 
                label="Nota 1" 
                placeholder="Ex: 7.5"
                keyboardType="numeric" 
                value={nota1} 
                onChangeText={setNota1} 
                error={errors.nota1}
              />
              <CustomInput 
                label="Nota 2" 
                placeholder="Ex: 8.0"
                keyboardType="numeric" 
                value={nota2} 
                onChangeText={setNota2} 
                error={errors.nota2}
              />
            </View>

            <View style={styles.modalActions}>
              <PrimaryButton 
                title="Salvar Alterações" 
                onPress={salvarNotas} 
                loading={loadingSubmit} 
              />
              <TouchableOpacity 
                style={styles.btnCancelar} 
                onPress={() => setModalVisible(false)} 
                disabled={loadingSubmit}
              >
                <Text style={styles.btnCancelarText}>Voltar sem salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: colors.background 
  },
  listHeader: {
    marginBottom: 20,
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: colors.textDark,
    marginBottom: 4,
  },
  subtitle: { 
    fontSize: 14, 
    color: colors.textLight,
    fontWeight: '600',
    lineHeight: 20 
  },
  listContent: { 
    padding: 20,
    paddingBottom: 40 
  },
  card: { 
    backgroundColor: colors.cardBg, 
    padding: 16, 
    borderRadius: 14, 
    marginBottom: 16,
    ...cardShadow,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eae8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  studentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  alunoNome: { 
    fontSize: 16, 
    fontWeight: '700',
    color: colors.textDark,
  },
  matricula: { 
    fontSize: 12, 
    color: colors.textLight,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f2f6',
    marginBottom: 12,
  },
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreBlock: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreVal: {
    fontSize: 15,
    color: colors.textDark,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  btnLancar: { 
    flexDirection: 'row',
    backgroundColor: colors.primary, 
    paddingVertical: 10,
    borderRadius: 8, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 14,
  },
  
  // Estilos do Modal
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: 'rgba(47, 53, 66, 0.6)', 
    padding: 20 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    padding: 24, 
    borderRadius: 16,
    ...shadow,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: '800',
    color: colors.textDark,
  },
  closeBtn: {
    padding: 4,
  },
  studentInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  modalStudentName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
  },
  modalStudentRa: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
  },
  modalForm: {
    marginBottom: 12,
  },
  modalActions: {
    marginTop: 12,
  },
  btnCancelar: { 
    marginTop: 14, 
    alignItems: 'center',
    paddingVertical: 8,
  },
  btnCancelarText: { 
    color: colors.danger, 
    fontSize: 14, 
    fontWeight: '700' 
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: { 
    color: colors.textLight, 
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
  }
});
