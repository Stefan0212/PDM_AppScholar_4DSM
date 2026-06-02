import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../hooks/AuthContext';
import { colors, cardShadow } from '../styles/theme';
import { PrimaryButton } from '../components/PrimaryButton';

export default function AdminDashboard({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const menuItems = [
    {
      title: 'Cadastrar Aluno',
      description: 'Adicionar novos estudantes e endereços com busca por CEP.',
      icon: 'person-add-outline',
      color: '#4a69bd',
      screen: 'CadastroAluno'
    },
    {
      title: 'Cadastrar Professor',
      description: 'Registrar novos professores, titulação e tempo de docência.',
      icon: 'people-outline',
      color: '#079992',
      screen: 'CadastroProfessor'
    },
    {
      title: 'Cadastrar Disciplina',
      description: 'Criar novas matérias vinculando a professores cadastrados.',
      icon: 'book-outline',
      color: '#e67e22',
      screen: 'CadastroDisciplina'
    },
    {
      title: 'Realizar Matrícula',
      description: 'Matricular alunos em lote em disciplinas do semestre.',
      icon: 'school-outline',
      color: '#8e44ad',
      screen: 'MatriculaAluno'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header de Boas Vindas */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(user?.nome)}</Text>
            </View>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Olá, Administrador</Text>
            <Text style={styles.userName}>{user?.nome || 'Usuário'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ferramentas de Gestão</Text>

        {/* Grid de Menus */}
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBadge, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={26} color={item.color} />
              </View>
              <View style={styles.cardTextContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão Sair */}
        <View style={styles.footer}>
          <PrimaryButton
            title="Encerrar Sessão"
            variant="danger"
            onPress={logout}
          />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    ...cardShadow,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '600',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDark,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
    paddingLeft: 4,
  },
  grid: {
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    ...cardShadow,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardTextContent: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
  },
  footer: {
    marginTop: 20,
  },
});
