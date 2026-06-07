import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../hooks/AuthContext';
import api from '../services/api';
import { colors, cardShadow } from '../styles/theme';

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
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Estatísticas do boletim
  const disciplinas = boletim?.disciplinas || [];
  const totalDisciplinas = disciplinas.length;
  const aprovadas = disciplinas.filter(d => d.situacao === 'Aprovado').length;
  const cursando = disciplinas.filter(d => d.situacao === 'Cursando').length;

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
        <View style={styles.cardHeader}>
          <Text style={styles.disciplinaNome}>{item.disciplina}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{item.situacao}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.scoresRow}>
          <View style={styles.scoreBlock}>
            <Text style={styles.scoreLabel}>Nota 1</Text>
            <Text style={styles.scoreVal}>{item.nota1 !== null ? item.nota1 : '-'}</Text>
          </View>
          <View style={styles.scoreBlock}>
            <Text style={styles.scoreLabel}>Nota 2</Text>
            <Text style={styles.scoreVal}>{item.nota2 !== null ? item.nota2 : '-'}</Text>
          </View>
          <View style={styles.scoreBlock}>
            <Text style={[styles.scoreLabel, { fontWeight: '700' }]}>Média Final</Text>
            <Text style={[styles.scoreVal, { fontWeight: '800', color: colors.textDark }]}>
              {item.media !== null ? item.media : '-'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={disciplinas}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* Bloco de Visão Geral do Aluno */}
            <View style={styles.studentCard}>
              <Ionicons name="school" size={24} color={colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.alunoLabel}>Estudante</Text>
                <Text style={styles.alunoNome}>{boletim?.aluno || user?.nome}</Text>
              </View>
            </View>

            {/* Painel de Estatísticas Acadêmicas */}
            {totalDisciplinas > 0 && (
              <View style={styles.statsPanel}>
                <View style={styles.statBox}>
                  <Text style={styles.statVal}>{totalDisciplinas}</Text>
                  <Text style={styles.statLabel}>Matérias</Text>
                </View>
                <View style={[styles.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border }]}>
                  <Text style={[styles.statVal, { color: colors.success }]}>{aprovadas}</Text>
                  <Text style={styles.statLabel}>Aprovadas</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statVal, { color: colors.warning }]}>{cursando}</Text>
                  <Text style={styles.statLabel}>Cursando</Text>
                </View>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyText}>Você não está matriculado em nenhuma disciplina.</Text>
          </View>
        }
      />
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
  listContent: { 
    padding: 20,
    paddingBottom: 40 
  },
  headerContainer: {
    marginBottom: 20,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    ...cardShadow,
  },
  alunoLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  alunoNome: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
    marginTop: 2,
  },
  statsPanel: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    paddingVertical: 14,
    ...cardShadow,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.cardBg,
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    ...cardShadow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  disciplinaNome: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: colors.textDark,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f2f6',
    marginBottom: 12,
  },
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: { 
    textAlign: 'center', 
    color: colors.textLight, 
    fontSize: 15,
    fontWeight: '600',
    marginTop: 16,
  }
});
