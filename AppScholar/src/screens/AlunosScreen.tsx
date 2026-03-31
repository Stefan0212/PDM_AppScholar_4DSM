// src/screens/AlunosScreen.tsx
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

export const AlunosScreen = () => {
  // Agrupamento do estado para facilitar a gestão do formulário
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    curso: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: ''
  });

  // Função genérica para atualizar qualquer campo do formulário
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleCadastrar = () => {
    // Validação simples exigida (verificar se os campos principais não estão vazios)
    if (!formData.nome || !formData.matricula || !formData.curso) {
      Alert.alert('Erro', 'Por favor, preencha pelo menos o Nome, Matrícula e Curso.');
      return;
    }

    // O projeto indica que nesta fase os dados podem ser apenas exibidos na consola
    console.log('Dados do Aluno Registado:', formData);
    
    Alert.alert('Sucesso', 'Aluno registado com sucesso!');
    
    // Limpar o formulário após o registo
    setFormData({
      nome: '', matricula: '', curso: '', email: '', telefone: '', cep: '', endereco: '', cidade: '', estado: ''
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Novo Aluno</Text>
          <Text style={styles.subtitle}>Preencha os dados académicos e pessoais</Text>
        </View>

        <Card>
          <CustomInput
            label="Nome Completo *"
            placeholder="Digite o nome do aluno"
            iconName="person-outline"
            value={formData.nome}
            onChangeText={(text) => handleChange('nome', text)}
          />

          <CustomInput
            label="Matrícula *"
            placeholder="Ex: 12345678"
            iconName="id-card-outline"
            keyboardType="numeric"
            value={formData.matricula}
            onChangeText={(text) => handleChange('matricula', text)}
          />

          <CustomInput
            label="Curso *"
            placeholder="Ex: Desenvolvimento de Software Multiplataforma"
            iconName="school-outline"
            value={formData.curso}
            onChangeText={(text) => handleChange('curso', text)}
          />

          <CustomInput
            label="Email"
            placeholder="aluno@dominio.com"
            iconName="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
          />

          <CustomInput
            label="Telefone"
            placeholder="(00) 00000-0000"
            iconName="call-outline"
            keyboardType="phone-pad"
            value={formData.telefone}
            onChangeText={(text) => handleChange('telefone', text)}
          />
        </Card>

        <Card style={styles.addressCard}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          
          <CustomInput
            label="CEP"
            placeholder="00000-000"
            iconName="map-outline"
            keyboardType="numeric"
            value={formData.cep}
            onChangeText={(text) => handleChange('cep', text)}
          />

          <CustomInput
            label="Endereço"
            placeholder="Rua, Avenida, etc."
            iconName="location-outline"
            value={formData.endereco}
            onChangeText={(text) => handleChange('endereco', text)}
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <CustomInput
                label="Cidade"
                placeholder="Sua cidade"
                value={formData.cidade}
                onChangeText={(text) => handleChange('cidade', text)}
              />
            </View>
            <View style={styles.halfInput}>
              <CustomInput
                label="Estado"
                placeholder="UF"
                maxLength={2}
                autoCapitalize="characters"
                value={formData.estado}
                onChangeText={(text) => handleChange('estado', text)}
              />
            </View>
          </View>
        </Card>

        <CustomButton 
          title="Registar Aluno" 
          onPress={handleCadastrar} 
          style={styles.submitButton}
        />

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
  addressCard: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primaryLight,
    marginBottom: 15,
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