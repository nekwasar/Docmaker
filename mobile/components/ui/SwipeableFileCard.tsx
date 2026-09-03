import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReanimatedSwipeable, SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography, Animation } from '../../lib/theme';
import { AnimatedPressable } from './AnimatedPressable';
import { useRef } from 'react';

interface SwipeableFileCardProps {
  file: {
    id: string;
    name: string;
    format: string;
    size?: string;
    date?: string;
    wordCount?: number;
  };
  onPress: () => void;
  onShare: () => void;
  onFavorite: () => void;
  onDelete: () => void;
  onConvert: () => void;
  isFavorite?: boolean;
}

const getFileIcon = (format: string) => {
  switch (format) {
    case 'pdf': return 'document-text';
    case 'docx': return 'document';
    case 'txt': return 'document-outline';
    case 'jpg':
    case 'png': return 'image';
    case 'xlsx':
    case 'csv': return 'grid';
    default: return 'document';
  }
};

const getFileColor = (format: string) => {
  switch (format) {
    case 'pdf': return Colors.indigo;
    case 'docx': return Colors.action;
    case 'jpg':
    case 'png': return Colors.emerald;
    case 'xlsx':
    case 'csv': return Colors.teal;
    default: return Colors.textSecondary;
  }
};

export function SwipeableFileCard({
  file,
  onPress,
  onShare,
  onFavorite,
  onDelete,
  onConvert,
  isFavorite = false,
}: SwipeableFileCardProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);

  const renderLeftActions = (progress: Animated.SharedValue<number>) => {
    const translateX = useAnimatedStyle(() => ({
      transform: [{ translateX: withSpring(progress.value > 0.8 ? 0 : -100) }],
    }));

    return (
      <View style={styles.leftActions}>
        <AnimatedPressable
          onPress={() => {
            swipeableRef.current?.close();
            onShare();
          }}
          haptic="light"
          style={[styles.actionButton, { backgroundColor: Colors.swipeShare }]}
        >
          <Ionicons name="share" size={20} color={Colors.white} />
          <Text style={styles.actionText}>Share</Text>
        </AnimatedPressable>
        <AnimatedPressable
          onPress={() => {
            swipeableRef.current?.close();
            onFavorite();
          }}
          haptic="light"
          style={[styles.actionButton, { backgroundColor: Colors.swipeFavorite }]}
        >
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={20} color={Colors.white} />
          <Text style={styles.actionText}>Favorite</Text>
        </AnimatedPressable>
      </View>
    );
  };

  const renderRightActions = (progress: Animated.SharedValue<number>) => {
    const translateX = useAnimatedStyle(() => ({
      transform: [{ translateX: withSpring(progress.value > 0.8 ? 0 : 100) }],
    }));

    return (
      <View style={styles.rightActions}>
        <AnimatedPressable
          onPress={() => {
            swipeableRef.current?.close();
            onDelete();
          }}
          haptic="warning"
          style={[styles.actionButton, { backgroundColor: Colors.swipeDelete }]}
        >
          <Ionicons name="trash" size={20} color={Colors.white} />
          <Text style={styles.actionText}>Delete</Text>
        </AnimatedPressable>
        <AnimatedPressable
          onPress={() => {
            swipeableRef.current?.close();
            onConvert();
          }}
          haptic="light"
          style={[styles.actionButton, { backgroundColor: Colors.swipeAction }]}
        >
          <Ionicons name="swap-horizontal" size={20} color={Colors.white} />
          <Text style={styles.actionText}>Convert</Text>
        </AnimatedPressable>
      </View>
    );
  };

  const fileColor = getFileColor(file.format);

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      leftThreshold={40}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
    >
      <AnimatedPressable
        onPress={onPress}
        haptic="light"
        style={styles.container}
      >
        <View style={[styles.leftBorder, { backgroundColor: fileColor }]} />
        <View style={[styles.iconContainer, { backgroundColor: fileColor + '15' }]}>
          <Ionicons name={getFileIcon(file.format) as any} size={22} color={fileColor} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{file.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{file.format.toUpperCase()}</Text>
            {file.size && <Text style={styles.dot}>•</Text>}
            {file.size && <Text style={styles.meta}>{file.size}</Text>}
            {file.date && <Text style={styles.dot}>•</Text>}
            {file.date && <Text style={styles.meta}>{file.date}</Text>}
          </View>
        </View>
        <View style={styles.pillBadge}>
          <Text style={[styles.pillText, { color: fileColor }]}>{file.format.toUpperCase()}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
      </AnimatedPressable>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: Radius.xl,
    borderBottomLeftRadius: Radius.xl,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    ...Typography.caption,
  },
  dot: {
    ...Typography.caption,
    marginHorizontal: Spacing.xs,
  },
  pillBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.canvas,
    marginRight: Spacing.sm,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginRight: Spacing.md,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: Spacing.md,
  },
  actionButton: {
    width: 72,
    height: '100%',
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
    fontSize: 10,
  },
});
