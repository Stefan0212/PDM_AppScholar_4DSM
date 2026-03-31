import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const CustomInput = ({ label, error, iconName, ...rest }: CustomInputProps) => {
  // Controle de estado local apenas para feedback visual (borda ativa) [cite: 50, 59]
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputFocused,
        error ? styles.inputError : null
      ]}>
        {iconName && (
          <Ionicons name={iconName} size={20} color={theme.colors.text} style={styles.icon} />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    color: theme.colors.text,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundNavy,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.backgroundNavy,
    height: 50,
    paddingHorizontal: 12,
  },
  inputFocused: {
    borderColor: theme.colors.primaryLight,
  },
  inputError: {
    borderColor: theme.colors.primaryLight, // Usando color4 para destacar o erro
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
  },
  errorText: {
    color: theme.colors.primaryLight,
    fontSize: 12,
    marginTop: 4,
  },
});