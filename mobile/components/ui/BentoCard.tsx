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
        <View style={styles.topRow}>
          <View style={[styles.iconBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name={icon as any} size={28} color={iconColor || Colors.white} />
          </View>
          {badge && (
            <View style={[styles.badge, { backgroundColor: badge.color }]}>
              <Text style={styles.badgeText}>{badge.text}</Text>
            </View>
          )}
        </View>

        <View style={styles.bottom}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconBadge: {
    width: 52,
    height: 52,
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
    gap: Spacing.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
  },
});
