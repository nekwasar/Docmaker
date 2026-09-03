import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Shadow } from '../../lib/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'flat' | 'accent';
  accentColor?: string;
  onPress?: () => void;
}

export function Card({
  children,
  style,
  variant = 'default',
  accentColor,
  onPress,
}: CardProps) {
  const getCardStyle = (): ViewStyle[] => {
    const base: ViewStyle = {
      backgroundColor: Colors.white,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      ...Shadow.card,
    };

    const variantStyles: Record<string, ViewStyle> = {
      default: {},
      flat: { shadowOpacity: 0, elevation: 0 },
      accent: {
        backgroundColor: (accentColor || Colors.primary) + '08',
        borderColor: (accentColor || Colors.primary) + '20',
      },
    };

    return [base, variantStyles[variant], style];
  };

  if (onPress) {
    return (
      <TouchableOpacity style={getCardStyle()} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={getCardStyle()}>{children}</View>;
}

interface CardSectionProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardSection({ children, style }: CardSectionProps) {
  return <View style={[{ padding: Spacing.xl }, style]}>{children}</View>;
}

const styles = StyleSheet.create({});
