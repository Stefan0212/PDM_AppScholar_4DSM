import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../hooks/AuthContext';
import { colors, cardShadow } from '../styles/theme';
import { PrimaryButton } from '../components/PrimaryButton';

export default function AlunoDashboard({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

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
            <Text style={styles.greeting}>Olá, Estudante</Text>
            <Text style={styles.userName}>{user?.nome || 'Aluno'}</Text>
            <Text style={styles.userRa}>RA: {user?.matricula || '-'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Área Acadêmica</Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('VisualizarBoletim')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBadge, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="document-text-outline" size={26} color={colors.primary} />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>Visualizar Meu Boletim</Text>
              <Text style={styles.cardDescription}>Acompanhe suas notas (N1, N2), médias bimestrais e situação em cada disciplina matriculada.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>
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
  userRa: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
    fontWeight: '700',
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
    padding: 20,
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
