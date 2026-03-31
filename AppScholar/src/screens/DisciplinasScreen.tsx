// src/screens/DisciplinasScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { theme } from '../styles/theme';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';

export const DisciplinasScreen = () => {
  const { user } = useAuth();
  
  // Regra de negócio: Apenas o Administrador pode cadastrar/editar disciplinas
  const canEdit = user?.role === 'admin';

  // Estado agrupado: se for Admin, os campos vêm vazios. Se for Aluno/Professor, vêm preenchidos para visualização.
  const [formData, setFormData] = useState({
    nomeDisciplina: canEdit ? '' : 'Programação para Dispositivos Móveis I',
    cargaHoraria: canEdit ? '' : '80h',
    professorResponsavel: canEdit ? '' : 'André Olímpio',
    curso: canEdit ? '' : 'Desenvolvimento de Software Multiplataforma',
    semestre: canEdit ? '' : '4º Semestre'
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleCadastrar = () => {
    if (!formData.nomeDisciplina || !formData.cargaHoraria || !formData.professorResponsavel || !formData.curso || !formData.semestre) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos da disciplina.');
      return;
    }

    console.log('Dados da Disciplina Registrada:', formData);
    Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!');
    
    setFormData({
      nomeDisciplina: '',
      cargaHoraria: '',
      professorResponsavel: '',
      curso: '',
      semestre: ''
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>{canEdit ? 'Nova Disciplina' : 'Grade Curricular'}</Text>
          <Text style={styles.subtitle}>
            {canEdit ? 'Cadastre as matérias da grade curricular' : 'Visualização das disciplinas do semestre'}
          </Text>
        </View>

        <Card>
          <CustomInput
            label="Nome da Disciplina *"
            placeholder="Ex: Programação para Dispositivos Móveis I"
            iconName="book-outline"
            value={formData.nomeDisciplina}
            onChangeText={(text) => handleChange('nomeDisciplina', text)}
            editable={canEdit}
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <CustomInput
                label="Carga Horária *"
                placeholder="Ex: 80h"
                iconName="time-outline"
                keyboardType="numeric"
                value={formData.cargaHoraria}
                onChangeText={(text) => handleChange('cargaHoraria', text)}
                editable={canEdit}
              />
            </View>
            <View style={styles.halfInput}>
              <CustomInput
                label="Semestre *"
                placeholder="Ex: 4º Semestre"
                iconName="calendar-outline"
                value={formData.semestre}
                onChangeText={(text) => handleChange('semestre', text)}
                editable={canEdit}
              />
            </View>
          </View>

          <CustomInput
            label="Professor Responsável *"
            placeholder="Nome do professor titular"
            iconName="person-outline"
            value={formData.professorResponsavel}
            onChangeText={(text) => handleChange('professorResponsavel', text)}
            editable={canEdit}
          />

          <CustomInput
            label="Curso *"
            placeholder="Ex: Análise e Desenvolvimento de Sistemas"
            iconName="school-outline"
            value={formData.curso}
            onChangeText={(text) => handleChange('curso', text)}
            editable={canEdit}
          />
        </Card>

        {/* O botão de Salvar só aparece se o usuário for um Administrador */}
        {canEdit && (
          <CustomButton 
            title="Salvar Disciplina" 
            onPress={handleCadastrar} 
            style={styles.submitButton}
          />
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 20,
  }
});