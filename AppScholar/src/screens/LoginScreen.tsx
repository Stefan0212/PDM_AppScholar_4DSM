// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { Card } from "../components/Card";
import { theme } from "../styles/theme";
import { useAuth } from "../hooks/useAuth";

// Tipagem básica temporária para a navegação que implementaremos a seguir
interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  // Gerenciamento de estado exigido pelo projeto
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const { login } = useAuth();

  // Função limpa e sem código duplicado
  const handleLogin = async () => {
    // 1. Limpa os erros anteriores
    setErrors({ email: "", password: "" });
    let hasError = false;
    let newErrors = { email: "", password: "" };

    // 2. Validação: Mensagem de erro caso campos estejam vazios
    if (!email.trim()) {
      newErrors.email = "O campo de email ou login é obrigatório.";
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = "O campo de senha é obrigatório.";
      hasError = true;
    }

    // 3. Interrompe o fluxo se houver erro ANTES de tentar logar
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // 4. Integração com a Context API
    try {
      await login(email, password); // Agora sim, loga com segurança
      navigation.replace("MainTabs");
    } catch (error) {
      Alert.alert("Erro", "Falha ao realizar login.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.title}>App Scholar</Text>
            <Text style={styles.subtitle}>Portal Acadêmico</Text>
          </View>

          <Card>
            <CustomInput
              label="Email ou Login"
              placeholder="Digite seu email"
              iconName="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />

            <CustomInput
              label="Senha"
              placeholder="Digite sua senha"
              iconName="lock-closed-outline"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />

            <CustomButton
              title="Entrar"
              onPress={handleLogin}
              style={styles.buttonSpacing}
            />
          </Card>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark, // color1
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: theme.colors.primaryLight, // color4 para dar um destaque vibrante
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text, // color5
    letterSpacing: 1.5,
  },
  buttonSpacing: {
    marginTop: 15,
  },
});