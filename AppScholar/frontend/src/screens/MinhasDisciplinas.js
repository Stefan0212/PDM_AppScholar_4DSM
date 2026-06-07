import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../hooks/AuthContext';
import api from '../services/api';
import { colors, cardShadow } from '../styles/theme';

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

    const unsubscribe = navigation.addListener('focus', () => {
      carregarDisciplinas();
    });

    return unsubscribe;
  }, [navigation, user.id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('LancamentoNotas', { disciplina: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.nome}</Text>
        <Ionicons name="people-outline" size={20} color={colors.primary} />
      </View>
      
      <Text style={styles.courseText}>{item.curso}</Text>
      
      <View style={styles.badgeContainer}>
        <View style={[styles.badge, styles.badgePrimary]}>
          <Text style={styles.badgeText}>{item.semestre}º Semestre</Text>
        </View>
        <View style={[styles.badge, styles.badgeSecondary]}>
          <Text style={styles.badgeText}>{item.carga_horaria} Horas</Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.actionText}>Gerenciar alunos e notas</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={turmas}
        keyExtractor={(item) => String(item.id_disciplina)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.subtitle}>
            Selecione uma disciplina abaixo para listar os alunos matriculados e realizar lançamentos de notas.
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="journal-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyText}>Nenhuma disciplina vinculada a você.</Text>
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
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  listContent: { 
    padding: 20,
    paddingBottom: 40 
  },
  card: {
    backgroundColor: colors.cardBg,
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    ...cardShadow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: colors.textDark,
    flex: 1,
    paddingRight: 8,
  },
  courseText: { 
    fontSize: 14, 
    color: colors.textLight, 
    fontWeight: '600',
    marginBottom: 12 
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  badgePrimary: {
    backgroundColor: '#eae8ff',
  },
  badgeSecondary: {
    backgroundColor: '#e3f2fd',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textDark,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
    paddingTop: 12,
  },
  actionText: { 
    fontSize: 13, 
    color: colors.primary, 
    fontWeight: '700' 
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 40,
    padding: 20,
  },
  emptyText: { 
    textAlign: 'center', 
    color: colors.textLight, 
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  }
});
