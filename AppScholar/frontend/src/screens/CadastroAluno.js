import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { fetchCep } from '../services/viacep';
import api from '../services/api';
import { colors, shadow } from '../styles/theme';

export default function CadastroAluno({ navigation }) {
  const [formData, setFormData] = useState({
    nome: '', email: '', senha: '', matricula: '', curso: '', telefone: '',
    cep: '', endereco: '', cidade: '', estado: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleCepBlur = async () => {
    const cepNumerico = formData.cep.replace(/\D/g, '');
    if (cepNumerico.length !== 8) {
      setErrors(prev => ({ ...prev, cep: 'CEP deve conter 8 dígitos.' }));
      return;
    }

    setLoadingCep(true);
    try {
      const dadosCep = await fetchCep(cepNumerico);
      if (dadosCep.erro) {
        Alert.alert('Aviso', 'CEP não encontrado.');
        setErrors(prev => ({ ...prev, cep: 'CEP não encontrado.' }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        endereco: dadosCep.logradouro || '',
        cidade: dadosCep.localidade || '',
        estado: dadosCep.uf || ''
      }));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar o CEP.');
    } finally {
      setLoadingCep(false);
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

    if (!formData.matricula.trim()) {
      newErrors.matricula = 'Matrícula é obrigatória.';
      valid = false;
    }

    if (!formData.curso.trim()) {
      newErrors.curso = 'Curso é obrigatório.';
      valid = false;
    }

    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Aviso', 'Por favor, corrija os erros do formulário antes de enviar.');
      return;
    }

    setLoadingSubmit(true);
    try {
      await api.post('/alunos', formData);
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error.response?.data?.error || 'Erro interno no servidor');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          
          <Text style={styles.sectionHeader}>Dados Pessoais e de Acesso</Text>
          <View style={styles.separator} />
          
          <CustomInput 
            label="Nome Completo *" 
            placeholder="Digite o nome do aluno"
            value={formData.nome} 
            onChangeText={(text) => handleInputChange('nome', text)} 
            error={errors.nome}
          />
          
          <CustomInput 
            label="E-mail Acadêmico *" 
            placeholder="exemplo@faculdade.com"
            keyboardType="email-address" 
            autoCapitalize="none" 
            value={formData.email} 
            onChangeText={(text) => handleInputChange('email', text)} 
            error={errors.email}
          />
          
          <CustomInput 
            label="Senha Provisória *" 
            placeholder="Mínimo 6 caracteres"
            secureTextEntry 
            value={formData.senha} 
            onChangeText={(text) => handleInputChange('senha', text)} 
            error={errors.senha}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <CustomInput 
                label="Matrícula/RA *" 
                placeholder="Código RA"
                value={formData.matricula} 
                onChangeText={(text) => handleInputChange('matricula', text)} 
                error={errors.matricula}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomInput 
                label="Telefone" 
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad" 
                value={formData.telefone} 
                onChangeText={(text) => handleInputChange('telefone', text)} 
                error={errors.telefone}
              />
            </View>
          </View>

          <CustomInput 
            label="Curso Matriculado *" 
            placeholder="Ex: Análise e Desenvolvimento de Sistemas"
            value={formData.curso} 
            onChangeText={(text) => handleInputChange('curso', text)} 
            error={errors.curso}
          />

          <Text style={[styles.sectionHeader, { marginTop: 16 }]}>Endereço Residencial</Text>
          <View style={styles.separator} />

          <View style={styles.rowCep}>
            <View style={{ flex: 1 }}>
              <CustomInput 
                label="CEP *" 
                placeholder="Apenas números"
                keyboardType="number-pad" 
                maxLength={8} 
                value={formData.cep} 
                onChangeText={(text) => handleInputChange('cep', text)} 
                onBlur={handleCepBlur}
                error={errors.cep}
              />
            </View>
            {loadingCep && (
              <View style={styles.loaderCepContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
          </View>

          <CustomInput 
            label="Endereço (Logradouro) *" 
            placeholder="Rua, Avenida..."
            value={formData.endereco} 
            onChangeText={(text) => handleInputChange('endereco', text)} 
            editable={!loadingCep} 
            error={errors.endereco}
          />

          <View style={styles.row}>
            <View style={{ flex: 2, marginRight: 12 }}>
              <CustomInput 
                label="Cidade *" 
                placeholder="Nome da cidade"
                value={formData.cidade} 
                onChangeText={(text) => handleInputChange('cidade', text)} 
                editable={!loadingCep} 
                error={errors.cidade}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomInput 
                label="Estado *" 
                placeholder="UF"
                maxLength={2}
                autoCapitalize="characters"
                value={formData.estado} 
                onChangeText={(text) => handleInputChange('estado', text)} 
                editable={!loadingCep} 
                error={errors.estado}
              />
            </View>
          </View>

          <PrimaryButton 
            title="Salvar Cadastro" 
            onPress={handleSubmit} 
            loading={loadingSubmit} 
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
  },
  row: { 
    flexDirection: 'row', 
  },
  rowCep: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative'
  },
  loaderCepContainer: {
    position: 'absolute',
    right: 14,
    top: 36,
  }
});
