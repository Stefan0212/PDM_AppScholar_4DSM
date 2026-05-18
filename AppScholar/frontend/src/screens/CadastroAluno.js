import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { fetchCep } from '../services/viacep';
import api from '../services/api';

export default function CadastroAluno({ navigation }) {
  const [formData, setFormData] = useState({
    nome: '', email: '', senha: '', matricula: '', curso: '', telefone: '',
    cep: '', endereco: '', cidade: '', estado: ''
  });
  
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCepBlur = async () => {
    const cepNumerico = formData.cep.replace(/\D/g, '');
    if (cepNumerico.length === 8) {
      setLoadingCep(true);
      try {
        const dadosCep = await fetchCep(cepNumerico);
        setFormData({
          ...formData,
          endereco: dadosCep.logradouro || '',
          cidade: dadosCep.localidade || '',
          estado: dadosCep.uf || ''
        });
      } catch (error) {
        Alert.alert('Erro', 'CEP não encontrado ou inválido.');
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.nome || !formData.email || !formData.senha || !formData.cep) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (Nome, Email, Senha e CEP).');
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CustomInput label="Nome Completo" value={formData.nome} onChangeText={(text) => handleInputChange('nome', text)} />
      <CustomInput label="E-mail" keyboardType="email-address" autoCapitalize="none" value={formData.email} onChangeText={(text) => handleInputChange('email', text)} />
      <CustomInput label="Senha" secureTextEntry value={formData.senha} onChangeText={(text) => handleInputChange('senha', text)} />
      <CustomInput label="Matrícula" value={formData.matricula} onChangeText={(text) => handleInputChange('matricula', text)} />
      <CustomInput label="Curso" value={formData.curso} onChangeText={(text) => handleInputChange('curso', text)} />
      <CustomInput label="Telefone" keyboardType="phone-pad" value={formData.telefone} onChangeText={(text) => handleInputChange('telefone', text)} />
      
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <CustomInput 
            label="CEP" 
            keyboardType="number-pad" 
            maxLength={8} 
            value={formData.cep} 
            onChangeText={(text) => handleInputChange('cep', text)} 
            onBlur={handleCepBlur}
          />
        </View>
        {loadingCep && <ActivityIndicator size="small" color="#007bff" style={{ alignSelf: 'center', marginTop: 10 }} />}
      </View>

      <CustomInput label="Endereço (Logradouro)" value={formData.endereco} onChangeText={(text) => handleInputChange('endereco', text)} editable={!loadingCep} />
      <CustomInput label="Cidade" value={formData.cidade} onChangeText={(text) => handleInputChange('cidade', text)} editable={!loadingCep} />
      <CustomInput label="Estado (UF)" value={formData.estado} onChangeText={(text) => handleInputChange('estado', text)} editable={!loadingCep} />

      <PrimaryButton title="Cadastrar Aluno" onPress={handleSubmit} loading={loadingSubmit} style={{ marginTop: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  row: { flexDirection: 'row', alignItems: 'center' }
});
