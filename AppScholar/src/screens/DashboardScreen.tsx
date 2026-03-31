// src/screens/DashboardScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { Card } from '../components/Card';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../navigation/types';

// Tipagem da navegação para termos o autocomplete e evitarmos erros
type DashboardScreenProps = {
  navigation: BottomTabNavigationProp<TabParamList, 'Dashboard'>;
};

export const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  
  // Função auxiliar para renderizar os cartões de atalho
  const renderQuickAction = (title: string, icon: keyof typeof Ionicons.glyphMap, route: keyof TabParamList) => (
    <TouchableOpacity 
      style={styles.actionCard} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate(route)}
    >
      <Ionicons name={icon} size={32} color={theme.colors.primaryLight} />
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Administrador</Text>
        <Text style={styles.subtitle}>Resumo do semestre</Text>
      </View>

      {/* Painel de Métricas (Lógica de Dashboard Analítico) */}
      <Card style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>124</Text>
          <Text style={styles.metricLabel}>Alunos</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>12</Text>
          <Text style={styles.metricLabel}>Professores</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>8</Text>
          <Text style={styles.metricLabel}>Disciplinas</Text>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Acesso Rápido</Text>

      {/* Grelha de Navegação */}
      <View style={styles.grid}>
        {renderQuickAction('Gerir Alunos', 'people', 'Alunos')}
        {renderQuickAction('Gerir Professores', 'school', 'Professores')}
        {renderQuickAction('Disciplinas', 'book', 'Disciplinas')}
        {renderQuickAction('Ver Boletim', 'document-text', 'Boletim')}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 25,
    marginBottom: 30,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primaryLight,
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.text,
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metricDivider: {
    width: 1,
    height: '70%',
    backgroundColor: theme.colors.placeholder,
    opacity: 0.3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%', // Permite colocar 2 cartões por linha com um pequeno espaçamento
    backgroundColor: theme.colors.backgroundNavy,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    // Sombras para dar profundidade
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    color: theme.colors.text,
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});