import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { TextInput, StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

/**
 * CustomInput — Campo de entrada reutilizável.
 *
 * Usa forwardRef para permitir foco programático (ex: pular do e-mail para senha).
 * Usa Pressable como wrapper para garantir que toques em qualquer parte da caixa
 * foquem o TextInput — resolve bug no Android / Expo Go onde o teclado não abria.
 */
export const CustomInput = forwardRef(
  ({ label, error, secureTextEntry, editable = true, style, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputRef = useRef(null);

    // Permite que o componente pai chame ref.current.focus()
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }));

    const shouldSecure = secureTextEntry && !isPasswordVisible;

    // Ao pressionar qualquer área do container, foca o TextInput manualmente
    const handleContainerPress = () => {
      if (editable && inputRef.current) {
        inputRef.current.focus();
      }
    };

    return (
      <View style={[styles.container, style]}>
        {label && (
          <Text
            style={styles.label}
            accessibilityRole="text"
          >
            {label}
          </Text>
        )}

        {/* Pressable envolve todo o campo para garantir que o toque sempre foque o input */}
        <Pressable
          onPress={handleContainerPress}
          style={[
            styles.inputContainer,
            isFocused && styles.inputFocused,
            error && styles.inputError,
            !editable && styles.inputDisabled,
          ]}
          accessibilityRole="none"
        >
          <TextInput
            ref={inputRef}
            style={[styles.input, !editable && styles.textDisabled]}
            placeholderTextColor="#a4b0be"
            secureTextEntry={shouldSecure}
            editable={editable}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            accessibilityLabel={label || props.placeholder}
            accessibilityState={{ disabled: !editable }}
            {...props}
          />
          {secureTextEntry && (
            <Pressable
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.iconContainer}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textLight}
              />
            </Pressable>
          )}
        </Pressable>

        {error && (
          <Text style={styles.errorText} accessibilityRole="alert">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 6,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textDark,
    paddingVertical: 12,
    // NÃO usar padding: 0 — causa bug de área de toque no Android
  },
  inputFocused: {
    borderColor: colors.borderActive,
    // Sem elevation dinâmica — causa perda de foco no Android
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputDisabled: {
    backgroundColor: '#eef0f3',
    borderColor: '#dcdde1',
  },
  textDisabled: {
    color: colors.textLight,
  },
  iconContainer: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});
