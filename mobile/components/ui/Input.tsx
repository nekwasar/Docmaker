import { View, Text, TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../lib/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  containerStyle,
  style,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={Colors.textSecondary}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

interface TextAreaProps extends InputProps {
  multiline?: boolean;
  numberOfLines?: number;
}

export function TextArea({
  label,
  error,
  containerStyle,
  style,
  multiline = true,
  numberOfLines = 4,
  ...props
}: TextAreaProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.textArea, error && styles.inputError, style]}
        placeholderTextColor={Colors.textSecondary}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    minHeight: 120,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  error: {
    ...Typography.caption,
    color: Colors.danger,
  },
});
