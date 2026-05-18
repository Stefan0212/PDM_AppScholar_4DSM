import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { PrimaryButton } from '../components/PrimaryButton';
import api from '../services/api';

export default function CadastroProfessor({ navigation }) {
  const [formData, setFormData] = useState({
    nome: '', email: '', senha: '', titulacao: '', area: '', tempo_docencia: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.email || !formData.senha || !formData.titulacao || !formData.area) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios.');
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CustomInput label="Nome Completo" value={formData.nome} onChangeText={(t) => handleInputChange('nome', t)} />
      <CustomInput label="E-mail" keyboardType="email-address" autoCapitalize="none" value={formData.email} onChangeText={(t) => handleInputChange('email', t)} />
      <CustomInput label="Senha" secureTextEntry value={formData.senha} onChangeText={(t) => handleInputChange('senha', t)} />
      <CustomInput label="Titulação (ex: Mestre, Doutor)" value={formData.titulacao} onChangeText={(t) => handleInputChange('titulacao', t)} />
      <CustomInput label="Área de Atuação" value={formData.area} onChangeText={(t) => handleInputChange('area', t)} />
      <CustomInput label="Tempo de Docência (em anos)" keyboardType="number-pad" value={formData.tempo_docencia} onChangeText={(t) => handleInputChange('tempo_docencia', t)} />

      <PrimaryButton title="Cadastrar Professor" onPress={handleSubmit} loading={loading} style={{ marginTop: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
});
