import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { theme } from '../styles/theme';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';

export const ProfessoresScreen = () => {
  const { user } = useAuth();
  // Regra: Somente Admin pode editar professores
  const canEdit = user?.role === 'admin';

  // Se não puder editar (Aluno/Professor visualizando), injetamos dados mockados
  const [formData, setFormData] = useState({
    nome: canEdit ? '' : 'Prof. André Olímpio',
    titulacao: canEdit ? '' : 'Especialista',
    areaAtuacao: canEdit ? '' : 'Desenvolvimento Mobile',
    tempoDocencia: canEdit ? '' : '10 anos',
    email: canEdit ? '' : 'andre.olimpio@fatec.sp.gov.br'
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));
  };

  const handleCadastrar = () => {
    if (!formData.nome || !formData.email) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios.');
      return;
    }
    Alert.alert('Sucesso', 'Professor registrado!');
    setFormData({ nome: '', titulacao: '', areaAtuacao: '', tempoDocencia: '', email: '' });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>{canEdit ? 'Novo Professor' : 'Corpo Docente'}</Text>
          <Text style={styles.subtitle}>
            {canEdit ? 'Insira os dados do corpo docente' : 'Visualização de professores cadastrados'}
          </Text>
        </View>

        <Card>
          {/* A propriedade editable={canEdit} bloqueia o teclado caso não seja Admin */}
          <CustomInput
            label="Nome Completo *"
            iconName="person-outline"
            value={formData.nome}
            onChangeText={(text) => handleChange('nome', text)}
            editable={canEdit} 
          />
          <CustomInput
            label="Titulação *"
            iconName="ribbon-outline"
            value={formData.titulacao}
            onChangeText={(text) => handleChange('titulacao', text)}
            editable={canEdit}
          />
          <CustomInput
            label="Área de Atuação *"
            iconName="briefcase-outline"
            value={formData.areaAtuacao}
            onChangeText={(text) => handleChange('areaAtuacao', text)}
            editable={canEdit}
          />
          <CustomInput
            label="Tempo de Docência *"
            iconName="time-outline"
            value={formData.tempoDocencia}
            onChangeText={(text) => handleChange('tempoDocencia', text)}
            editable={canEdit}
          />
          <CustomInput
            label="Email Institucional *"
            iconName="mail-outline"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            editable={canEdit}
          />
        </Card>

        {/* O botão só é renderizado se o usuário for Admin */}
        {canEdit && (
          <CustomButton title="Registrar Professor" onPress={handleCadastrar} style={styles.submitButton} />
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ... mantenha os mesmos styles de antes
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundDark },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  subtitle: { fontSize: 14, color: theme.colors.placeholder, marginTop: 4 },
  submitButton: { marginTop: 20, marginBottom: 20 }
});