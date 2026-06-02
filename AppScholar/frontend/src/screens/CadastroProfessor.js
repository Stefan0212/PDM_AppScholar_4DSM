import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { PrimaryButton } from '../components/PrimaryButton';
import api from '../services/api';
import { colors, shadow } from '../styles/theme';

export default function CadastroProfessor({ navigation }) {
  const [formData, setFormData] = useState({
    nome: '', email: '', senha: '', titulacao: '', area: '', tempo_docencia: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome completo é obrigatório.';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
      valid = false;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Digite um e-mail válido.';
      valid = false;
    }

    if (!formData.senha || formData.senha.length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres.';
      valid = false;
    }

    if (!formData.titulacao.trim()) {
      newErrors.titulacao = 'Titulação acadêmica é obrigatória.';
      valid = false;
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Área de atuação é obrigatória.';
      valid = false;
    }

    if (formData.tempo_docencia && isNaN(parseInt(formData.tempo_docencia, 10))) {
      newErrors.tempo_docencia = 'Docência deve ser um número.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Aviso', 'Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        tempo_docencia: formData.tempo_docencia ? parseInt(formData.tempo_docencia, 10) : null
      };

      await api.post('/professores', payload);
      Alert.alert('Sucesso', 'Professor cadastrado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error.response?.data?.error || 'Erro interno no servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          
          <Text style={styles.sectionHeader}>Dados de Acesso e Perfil</Text>
          <View style={styles.separator} />

          <CustomInput 
            label="Nome Completo *" 
            placeholder="Ex: Dr. André Olímpio"
            value={formData.nome} 
            onChangeText={(t) => handleInputChange('nome', t)} 
            error={errors.nome}
          />
          
          <CustomInput 
            label="E-mail *" 
            placeholder="professor@email.com"
            keyboardType="email-address" 
            autoCapitalize="none" 
            value={formData.email} 
            onChangeText={(t) => handleInputChange('email', t)} 
            error={errors.email}
          />
          
          <CustomInput 
            label="Senha *" 
            placeholder="Mínimo de 6 caracteres"
            secureTextEntry 
            value={formData.senha} 
            onChangeText={(t) => handleInputChange('senha', t)} 
            error={errors.senha}
          />

          <Text style={[styles.sectionHeader, { marginTop: 16 }]}>Atuação e Titulação</Text>
          <View style={styles.separator} />

          <CustomInput 
            label="Titulação Acadêmica *" 
            placeholder="Ex: Mestre, Doutor, Especialista"
            value={formData.titulacao} 
            onChangeText={(t) => handleInputChange('titulacao', t)} 
            error={errors.titulacao}
          />
          
          <CustomInput 
            label="Área de Atuação principal *" 
            placeholder="Ex: Desenvolvimento Mobile, Banco de Dados"
            value={formData.area} 
            onChangeText={(t) => handleInputChange('area', t)} 
            error={errors.area}
          />
          
          <CustomInput 
            label="Tempo de Docência (anos)" 
            placeholder="Ex: 5"
            keyboardType="number-pad" 
            value={formData.tempo_docencia} 
            onChangeText={(t) => handleInputChange('tempo_docencia', t)} 
            error={errors.tempo_docencia}
          />

          <PrimaryButton 
            title="Salvar Cadastro" 
            onPress={handleSubmit} 
            loading={loading} 
            style={{ marginTop: 24 }} 
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { 
    padding: 20,
    paddingBottom: 40
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    ...shadow,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
  }
});
