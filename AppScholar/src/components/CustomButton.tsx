// src/components/CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { theme } from '../styles/theme';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export const CustomButton = ({ title, variant = 'primary', style, ...rest }: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' ? styles.secondaryButton : styles.primaryButton,
        style
      ]}
      activeOpacity={0.8}
      {...rest}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },
  text: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});