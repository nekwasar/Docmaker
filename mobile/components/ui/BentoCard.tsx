import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { AnimatedPressable } from './AnimatedPressable';

interface BentoCardProps {
  variant: 'hero' | 'standard' | 'wide' | 'tall';
  color: string;
  icon: string;
  iconColor?: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  badge?: { text: string; color: string };
  style?: ViewStyle;
}

export function BentoCard({
  variant,
  color,
  icon,
  iconColor,
  title,
  subtitle,
  onPress,
  badge,
  style,
}: BentoCardProps) {
  const getCardHeight = () => {
    switch (variant) {
      case 'hero': return 180;
      case 'standard': return 140;
      case 'wide': return 120;
      case 'tall': return 200;
      default: return 140;
    }
  };

  const isColSpan2 = variant === 'hero' || variant === 'wide';

  return (
    <AnimatedPressable
      onPress={onPress}
      haptic="light"
      style={[
        styles.container,
        {
          height: getCardHeight(),
          backgroundColor: color,
          width: isColSpan2 ? '100%' : '48%',
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name={icon as any} size={24} color={iconColor || Colors.white} />
          </View>
          {badge && (
            <View style={[styles.badge, { backgroundColor: badge.color }]}>
              <Text style={styles.badgeText}>{badge.text}</Text>
            </View>
          )}
        </View>

        <View style={styles.bottom}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
          </View>
          <View style={styles.arrowPill}>
            <Ionicons name="arrow-forward" size={14} color={Colors.white} />
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.bento,
    overflow: 'hidden',
    ...Shadow.card,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 10,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    ...Typography.h3,
    color: Colors.white,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  arrowPill: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
