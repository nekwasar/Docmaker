import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Colors, Spacing, Radius } from '../../lib/theme';

interface SkeletonLoaderProps {
  variant?: 'card' | 'listItem' | 'bento' | 'text' | 'avatar';
  count?: number;
  width?: number | string;
  height?: number;
}

function SkeletonBlock({ 
  width, 
  height, 
  borderRadius, 
  delay = 0 
}: { 
  width: number | string; 
  height: number; 
  borderRadius?: number;
  delay?: number;
}) {
  return (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{
        loop: true,
        repeatReverse: true,
        duration: 1000,
        delay,
      }}
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: borderRadius || Radius.sm,
        },
      ]}
    />
  );
}

export function SkeletonLoader({
  variant = 'listItem',
  count = 3,
  width,
  height,
}: SkeletonLoaderProps) {
  const renderSkeleton = (index: number) => {
    const delay = index * 80;

    switch (variant) {
      case 'bento':
        return (
          <View key={index} style={styles.bentoRow}>
            <SkeletonBlock width="48%" height={140} borderRadius={Radius.bento} delay={delay} />
            <SkeletonBlock width="48%" height={140} borderRadius={Radius.bento} delay={delay + 40} />
          </View>
        );

      case 'card':
        return (
          <View key={index} style={styles.cardSkeleton}>
            <SkeletonBlock width={48} height={48} borderRadius={Radius.md} delay={delay} />
            <View style={styles.cardContent}>
              <SkeletonBlock width="70%" height={16} delay={delay + 20} />
              <SkeletonBlock width="40%" height={12} delay={delay + 40} />
            </View>
          </View>
        );

      case 'listItem':
        return (
          <View key={index} style={styles.listItemSkeleton}>
            <SkeletonBlock width={4} height={56} borderRadius={2} delay={delay} />
            <SkeletonBlock width={44} height={44} borderRadius={Radius.md} delay={delay + 10} />
            <View style={styles.listContent}>
              <SkeletonBlock width="60%" height={14} delay={delay + 20} />
              <SkeletonBlock width="40%" height={10} delay={delay + 30} />
            </View>
            <SkeletonBlock width={50} height={20} borderRadius={Radius.full} delay={delay + 40} />
          </View>
        );

      case 'text':
        return (
          <View key={index} style={styles.textSkeleton}>
            <SkeletonBlock width="100%" height={14} delay={delay} />
            <SkeletonBlock width="90%" height={14} delay={delay + 20} />
            <SkeletonBlock width="70%" height={14} delay={delay + 40} />
          </View>
        );

      case 'avatar':
        return (
          <View key={index} style={styles.avatarSkeleton}>
            <SkeletonBlock width={40} height={40} borderRadius={Radius.full} delay={delay} />
            <View style={styles.avatarContent}>
              <SkeletonBlock width={120} height={14} delay={delay + 20} />
              <SkeletonBlock width={80} height={10} delay={delay + 40} />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  skeleton: {
    backgroundColor: Colors.borderSolid,
  },
  bentoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  cardSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardContent: {
    flex: 1,
    marginLeft: Spacing.md,
    gap: Spacing.xs,
  },
  listItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  listContent: {
    flex: 1,
    marginLeft: Spacing.md,
    gap: Spacing.xs,
  },
  textSkeleton: {
    gap: Spacing.sm,
  },
  avatarSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarContent: {
    gap: Spacing.xs,
  },
});
