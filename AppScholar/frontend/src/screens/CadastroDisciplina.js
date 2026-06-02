import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { SelectorModal } from '../components/SelectorModal';
import api from '../services/api';
import { colors, shadow } from '../styles/theme';

export default function CadastroDisciplina({ navigation }) {
  const [formData, setFormData] = useState({
    professor_id: '', nome: '', carga_horaria: '', curso: '', semestre: ''
  });
  
  const [professores, setProfessores] = useState([]);
  const [selectedProfessorName, setSelectedProfessorName] = useState('');
  const [loadingProfessores, setLoadingProfessores] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function carregarProfessores() {
      try {
        const response = await api.get('/professores');
        setProfessores(response.data);
      } catch (error) {
        console.error('Erro ao buscar professores:', error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de professores.');
      } finally {
        setLoadingProfessores(false);
      }
    }
    carregarProfessores();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.professor_id) {
      newErrors.professor_id = 'A escolha de um professor é obrigatória.';
      valid = false;
    }

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da disciplina é obrigatório.';
      valid = false;
    }

    if (!formData.carga_horaria || isNaN(parseInt(formData.carga_horaria, 10)) || parseInt(formData.carga_horaria, 10) <= 0) {
      newErrors.carga_horaria = 'Carga horária deve ser um número positivo.';
      valid = false;
    }

    if (!formData.curso.trim()) {
      newErrors.curso = 'Curso associado é obrigatório.';
      valid = false;
    }

    if (!formData.semestre || isNaN(parseInt(formData.semestre, 10)) || parseInt(formData.semestre, 10) < 1) {
      newErrors.semestre = 'Semestre acadêmico inválido.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Aviso', 'Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    setLoadingSubmit(true);
    try {
      const payload = {
        professor_id: parseInt(formData.professor_id, 10),
        nome: formData.nome.trim(),
        carga_horaria: parseInt(formData.carga_horaria, 10),
        curso: formData.curso.trim(),
        semestre: parseInt(formData.semestre, 10)
      };

      await api.post('/disciplinas', payload);
      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error.response?.data?.error || 'Erro interno no servidor');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Mapear professores para formato aceito pelo SelectorModal
  const professorOptions = professores.map(p => ({
    id: p.id_professor,
    name: p.nome,
    sublabel: `${p.titulacao} • Área: ${p.area}`
  }));

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          
          <Text style={styles.sectionHeader}>Estrutura da Matéria</Text>
          <View style={styles.separator} />

          <SelectorModal
            label="Docente Responsável *"
            placeholder={loadingProfessores ? "Carregando professores..." : "Selecione o professor..."}
            options={professorOptions}
            selectedValue={formData.professor_id}
            selectedLabel={selectedProfessorName}
            loading={loadingProfessores}
            onSelect={(option) => {
              handleInputChange('professor_id', option.id);
              setSelectedProfessorName(option.name);
            }}
            error={errors.professor_id}
          />

          <CustomInput 
            label="Nome da Disciplina *" 
            placeholder="Ex: Programação Móvel I"
            value={formData.nome} 
            onChangeText={(t) => handleInputChange('nome', t)} 
            error={errors.nome}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <CustomInput 
                label="Carga Horária (horas) *" 
                placeholder="Ex: 80"
                keyboardType="number-pad" 
                value={formData.carga_horaria} 
                onChangeText={(t) => handleInputChange('carga_horaria', t)} 
                error={errors.carga_horaria}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomInput 
                label="Semestre Alvo *" 
                placeholder="Ex: 4"
                keyboardType="number-pad" 
                value={formData.semestre} 
                onChangeText={(t) => handleInputChange('semestre', t)} 
                error={errors.semestre}
              />
            </View>
          </View>

          <CustomInput 
            label="Curso pertencente *" 
            placeholder="Ex: Análise e Desenvolvimento de Sistemas"
            value={formData.curso} 
            onChangeText={(t) => handleInputChange('curso', t)} 
            error={errors.curso}
          />

          <PrimaryButton 
            title="Cadastrar Disciplina" 
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
  }
});
