import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { AnimatedPressable } from './AnimatedPressable';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 500, delay: 100 }}
        style={styles.iconContainer}
      >
        <View style={styles.iconCircle}>
          <Ionicons name={icon as any} size={48} color={Colors.primary} />
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 500, delay: 200 }}
        style={styles.textContainer}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </MotiView>

      {actionLabel && onAction && (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 500, delay: 300 }}
        >
          <AnimatedPressable
            onPress={onAction}
            haptic="light"
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>{actionLabel}</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.white} />
          </AnimatedPressable>
        </MotiView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.xxxl,
  },
  iconContainer: {
    marginBottom: Spacing.xxl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.full,
    ...Shadow.md,
  },
  actionText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
});
