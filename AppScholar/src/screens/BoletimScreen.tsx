// src/screens/BoletimScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../styles/theme';
import { Card } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

// Tipagem dos dados simulados
interface Disciplina {
  id: string;
  nome: string;
  nota1: number;
  nota2: number;
  media: number;
  situacao: 'Aprovado' | 'Reprovado' | 'Em Exame';
}

// Dados mockados exigidos pela Parte 1 do projeto
const mockBoletim: Disciplina[] = [
  {
    id: '1',
    nome: 'Programação para Dispositivos Móveis I',
    nota1: 8.5,
    nota2: 9.0,
    media: 8.75,
    situacao: 'Aprovado',
  },
  {
    id: '2',
    nome: 'Desenvolvimento de Software Multiplataforma',
    nota1: 7.0,
    nota2: 7.5,
    media: 7.25,
    situacao: 'Aprovado',
  },
  {
    id: '3',
    nome: 'Estrutura de Dados',
    nota1: 4.5,
    nota2: 5.0,
    media: 4.75,
    situacao: 'Reprovado',
  },
  {
    id: '4',
    nome: 'Engenharia de Software',
    nota1: 6.0,
    nota2: 6.0,
    media: 6.0,
    situacao: 'Em Exame',
  }
];

export const BoletimScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Meu Boletim</Text>
          <Text style={styles.subtitle}>Notas e situação do semestre atual</Text>
        </View>

        {mockBoletim.map((item) => (
          <Card key={item.id} style={styles.cardSpacing}>
            <View style={styles.disciplinaHeader}>
              <Ionicons name="book" size={20} color={theme.colors.primaryLight} style={styles.icon} />
              <Text style={styles.disciplinaNome}>{item.nome}</Text>
            </View>

            <View style={styles.notasContainer}>
              <View style={styles.notaBox}>
                <Text style={styles.notaLabel}>Nota 1</Text>
                <Text style={styles.notaValue}>{item.nota1.toFixed(1)}</Text>
              </View>
              
              <View style={styles.notaDivider} />
              
              <View style={styles.notaBox}>
                <Text style={styles.notaLabel}>Nota 2</Text>
                <Text style={styles.notaValue}>{item.nota2.toFixed(1)}</Text>
              </View>
              
              <View style={styles.notaDivider} />
              
              <View style={styles.notaBox}>
                <Text style={styles.notaLabel}>Média</Text>
                <Text style={[styles.notaValue, { color: theme.colors.primary }]}>
                  {item.media.toFixed(1)}
                </Text>
              </View>
            </View>

            <View style={styles.situacaoContainer}>
              <Text style={styles.situacaoLabel}>Situação:</Text>
              <Text style={[
                styles.situacaoValue,
                item.situacao === 'Reprovado' ? styles.textDanger : styles.textSuccess
              ]}>
                {item.situacao.toUpperCase()}
              </Text>
            </View>
          </Card>
        ))}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  cardSpacing: {
    marginBottom: 16,
    padding: 15,
  },
  disciplinaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  disciplinaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  notasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)', // Fundo sutil para destacar as notas
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  notaBox: {
    flex: 1,
    alignItems: 'center',
  },
  notaLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  notaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  notaDivider: {
    width: 1,
    height: '80%',
    backgroundColor: theme.colors.placeholder,
    opacity: 0.3,
  },
  situacaoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  situacaoLabel: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginRight: 8,
  },
  situacaoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  textSuccess: {
    color: theme.colors.text, // Aprovado fica com a cor neutra do texto
  },
  textDanger: {
    color: theme.colors.primaryLight, // Reprovado chama atenção com o vermelho/rosa
  }
});