import React, { useState, useContext, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Keyboard,
} from 'react-native';
import { AuthContext } from '../hooks/AuthContext';
import { CustomInput } from '../components/CustomInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, shadow } from '../styles/theme';

// Validação simples de formato de e-mail
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginScreen() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // Erros inline por campo
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');

  // Refs para foco programático
  const senhaRef = useRef(null);

  // --- Validação em tempo real ---
  const handleEmailBlur = useCallback(() => {
    if (email && !isValidEmail(email.trim())) {
      setEmailError('Formato de e-mail inválido');
    } else {
      setEmailError('');
    }
  }, [email]);

  const handleEmailChange = useCallback((text) => {
    setEmail(text);
    if (emailError) setEmailError('');
  }, [emailError]);

  const handleSenhaChange = useCallback((text) => {
    setSenha(text);
    if (senhaError) setSenhaError('');
  }, [senhaError]);

  // --- Submit ---
  const handleLogin = async () => {
    Keyboard.dismiss();

    let hasError = false;

    if (!email.trim()) {
      setEmailError('O e-mail é obrigatório');
      hasError = true;
    } else if (!isValidEmail(email.trim())) {
      setEmailError('Formato de e-mail inválido');
      hasError = true;
    }

    if (!senha) {
      setSenhaError('A senha é obrigatória');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const result = await login(email.trim(), senha);
      if (!result.success) {
        Alert.alert('Falha na Autenticação', result.message);
      }
    } catch {
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.card}>
          {/* Logo e Cabeçalho */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>AS</Text>
            </View>
            <Text style={styles.title}>App Scholar</Text>
            <Text style={styles.subtitle}>Gestão e Acompanhamento Acadêmico</Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <CustomInput
              label="E-mail Institucional"
              placeholder="Ex: joao@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => senhaRef.current?.focus()}
              value={email}
              onChangeText={handleEmailChange}
              onBlur={handleEmailBlur}
              error={emailError}
            />

            <CustomInput
              ref={senhaRef}
              label="Senha de Acesso"
              placeholder="Digite sua senha"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              value={senha}
              onChangeText={handleSenhaChange}
              error={senhaError}
            />

            <PrimaryButton
              title="Acessar Sistema"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
            />
          </View>
        </View>
        <Text style={styles.footerText}>FATEC Jacareí • PDM I</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    ...shadow,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoBadgeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textDark,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 12,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 24,
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
