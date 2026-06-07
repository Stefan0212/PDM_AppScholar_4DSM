import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { SelectorModal } from '../components/SelectorModal';
import api from '../services/api';
import { colors, shadow } from '../styles/theme';

export default function MatriculaAluno({ navigation }) {
  const [formData, setFormData] = useState({
    id_aluno: '', 
    id_disciplina: ''
  });
  
  const [alunos, setAlunos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  
  const [selectedAlunoName, setSelectedAlunoName] = useState('');
  const [selectedDisciplinaName, setSelectedDisciplinaName] = useState('');
  
  const [loadingDados, setLoadingDados] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function carregarDados() {
      try {
        // Busca alunos e disciplinas simultaneamente
        const [responseAlunos, responseDisciplinas] = await Promise.all([
          api.get('/alunos'),
          api.get('/disciplinas')
        ]);
        
        setAlunos(responseAlunos.data);
        setDisciplinas(responseDisciplinas.data);
      } catch (error) {
        console.error('Erro ao buscar dados para matrícula:', error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de alunos ou disciplinas.');
      } finally {
        setLoadingDados(false);
      }
    }
    carregarDados();
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

    if (!formData.id_aluno) {
      newErrors.id_aluno = 'A escolha de um aluno é obrigatória.';
      valid = false;
    }

    if (!formData.id_disciplina) {
      newErrors.id_disciplina = 'A escolha de uma disciplina é obrigatória.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Aviso', 'Selecione o aluno e a disciplina para realizar a matrícula.');
      return;
    }

    setLoadingSubmit(true);
    try {
      // Ajuste o payload para refletir a nova lógica
      const payload = {
        aluno_id: parseInt(formData.id_aluno, 10),
        disciplina_id: parseInt(formData.id_disciplina, 10)
      };

      // Chama a rota de matrícula passando o vínculo direto
      await api.post('/boletins/matricula', payload);
      Alert.alert('Sucesso', 'Aluno matriculado na disciplina com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro na Matrícula', error.response?.data?.error || 'Erro interno no servidor');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Mapeamento para o SelectorModal
  const alunoOptions = alunos.map(a => ({
    id: a.id_aluno,
    name: a.nome,
    sublabel: `RA: ${a.matricula} • Curso: ${a.curso}`
  }));

  const disciplinaOptions = disciplinas.map(d => ({
    id: d.id_disciplina,
    name: d.nome,
    sublabel: `Curso: ${d.curso} • Semestre: ${d.semestre} • Carga: ${d.carga_horaria}h`
  }));

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          
          <Text style={styles.sectionHeader}>Matrícula em Disciplina</Text>
          <View style={styles.separator} />

          <SelectorModal
            label="Aluno *"
            placeholder={loadingDados ? "Carregando alunos..." : "Selecione o aluno..."}
            options={alunoOptions}
            selectedValue={formData.id_aluno}
            selectedLabel={selectedAlunoName}
            loading={loadingDados}
            onSelect={(option) => {
              handleInputChange('id_aluno', option.id);
              setSelectedAlunoName(option.name);
            }}
            error={errors.id_aluno}
          />

          <SelectorModal
            label="Disciplina *"
            placeholder={loadingDados ? "Carregando disciplinas..." : "Selecione a disciplina..."}
            options={disciplinaOptions}
            selectedValue={formData.id_disciplina}
            selectedLabel={selectedDisciplinaName}
            loading={loadingDados}
            onSelect={(option) => {
              handleInputChange('id_disciplina', option.id);
              setSelectedDisciplinaName(option.name);
            }}
            error={errors.id_disciplina}
          />

          <PrimaryButton 
            title="Realizar Matrícula" 
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
  }
});