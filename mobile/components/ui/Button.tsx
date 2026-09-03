import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = () => {
    const base: ViewStyle = {
      borderRadius: Radius.full,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
    };

    const sizeStyles: Record<string, ViewStyle> = {
      sm: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
      md: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
      lg: { paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.lg },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: { backgroundColor: Colors.primary },
      secondary: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
      ghost: { backgroundColor: 'transparent' },
      danger: { backgroundColor: Colors.danger },
    };

    return [base, sizeStyles[size], variantStyles[variant], disabled && { opacity: 0.5 }, style];
  };

  const getTextStyle = () => {
    const variantTextStyles: Record<string, TextStyle> = {
      primary: { color: Colors.white },
      secondary: { color: Colors.textPrimary },
      ghost: { color: Colors.primary },
      danger: { color: Colors.white },
    };

    return [styles.text, variantTextStyles[variant], textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? Colors.white : Colors.primary} size="small" />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    ...Typography.body,
    fontWeight: '600',
  },
});
