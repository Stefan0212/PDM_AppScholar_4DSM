// src/components/Card.tsx
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../styles/theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card = ({ children, style, ...rest }: CardProps) => {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.backgroundNavy,
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    // Sombras para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    // Sombra para Android
    elevation: 8,
  },
});