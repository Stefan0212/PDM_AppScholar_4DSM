import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { PrimaryButton } from '../components/PrimaryButton';
import api from '../services/api';

export default function MatriculaAluno({ navigation }) {
  const [formData, setFormData] = useState({
    id_aluno: '', curso: '', semestre: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.id_aluno || !formData.curso || !formData.semestre) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id_aluno: parseInt(formData.id_aluno, 10),
        curso: formData.curso,
        semestre: parseInt(formData.semestre, 10)
      };

      const response = await api.post('/boletins/matricula', payload);
      Alert.alert('Sucesso', `Matrículas realizadas: ${response.data.novasMatriculas}`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro na Matrícula', error.response?.data?.error || 'Erro interno no servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CustomInput label="ID do Aluno" keyboardType="number-pad" value={formData.id_aluno} onChangeText={(t) => handleInputChange('id_aluno', t)} />
      <CustomInput label="Curso (ex: Análise e Desenvolvimento)" value={formData.curso} onChangeText={(t) => handleInputChange('curso', t)} />
      <CustomInput label="Semestre (ex: 1, 2, 3)" keyboardType="number-pad" value={formData.semestre} onChangeText={(t) => handleInputChange('semestre', t)} />

      <PrimaryButton title="Matricular em Lote" onPress={handleSubmit} loading={loading} style={{ marginTop: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
});
