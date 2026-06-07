import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, shadow } from '../styles/theme';

export const PrimaryButton = ({ title, onPress, loading, style, variant = 'primary' }) => {
  const isDanger = variant === 'danger';
  const buttonStyle = isDanger ? styles.buttonDanger : styles.buttonPrimary;
  
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    ...shadow,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
