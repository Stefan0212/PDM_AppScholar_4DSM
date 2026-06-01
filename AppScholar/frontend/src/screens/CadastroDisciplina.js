import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { PrimaryButton } from '../components/PrimaryButton';
import api from '../services/api';

export default function CadastroDisciplina({ navigation }) {
  const [formData, setFormData] = useState({
    professor_id: '', nome: '', carga_horaria: '', curso: '', semestre: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.professor_id || !formData.nome || !formData.carga_horaria || !formData.curso || !formData.semestre) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        professor_id: parseInt(formData.professor_id, 10),
        nome: formData.nome,
        carga_horaria: parseInt(formData.carga_horaria, 10),
        curso: formData.curso,
        semestre: parseInt(formData.semestre, 10)
      };

      await api.post('/disciplinas', payload);
      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error.response?.data?.error || 'Erro interno no servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CustomInput label="ID do Professor" keyboardType="number-pad" value={formData.professor_id} onChangeText={(t) => handleInputChange('professor_id', t)} />
      <CustomInput label="Nome da Disciplina" value={formData.nome} onChangeText={(t) => handleInputChange('nome', t)} />
      <CustomInput label="Carga Horária (em horas)" keyboardType="number-pad" value={formData.carga_horaria} onChangeText={(t) => handleInputChange('carga_horaria', t)} />
      <CustomInput label="Curso (ex: Análise e Desenvolvimento)" value={formData.curso} onChangeText={(t) => handleInputChange('curso', t)} />
      <CustomInput label="Semestre (ex: 1, 2, 3)" keyboardType="number-pad" value={formData.semestre} onChangeText={(t) => handleInputChange('semestre', t)} />

      <PrimaryButton title="Cadastrar Disciplina" onPress={handleSubmit} loading={loading} style={{ marginTop: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
});
