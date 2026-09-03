import { View, Text, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '../../lib/theme';
import { AnimatedPressable } from './AnimatedPressable';
import { useCallback, useMemo, useRef } from 'react';

interface FileActionsSheetProps {
  isVisible: boolean;
  file: { id: string; name: string; format: string } | null;
  onClose: () => void;
  onView: () => void;
  onEdit: () => void;
  onShare: () => void;
  onConvert: () => void;
  onSign: () => void;
  onDelete: () => void;
}

interface ActionItemProps {
  icon: string;
  label: string;
  color?: string;
  onPress: () => void;
  isDestructive?: boolean;
}

function ActionItem({ icon, label, color, onPress, isDestructive }: ActionItemProps) {
  return (
    <AnimatedPressable
      onPress={onPress}
      haptic="light"
      style={styles.actionItem}
    >
      <View style={[styles.actionIcon, { backgroundColor: (color || Colors.primary) + '15' }]}>
        <Ionicons 
          name={icon as any} 
          size={22} 
          color={isDestructive ? Colors.danger : color || Colors.primary} 
        />
      </View>
      <Text style={[styles.actionLabel, isDestructive && styles.destructiveText]}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
    </AnimatedPressable>
  );
}

export function FileActionsSheet({
  isVisible,
  file,
  onClose,
  onView,
  onEdit,
  onShare,
  onConvert,
  onSign,
  onDelete,
}: FileActionsSheetProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  if (!isVisible || !file) return null;

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={({ style }) => (
        <View style={[style, styles.backdrop]} />
      )}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
            <Text style={styles.fileFormat}>{file.format.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <ActionItem
            icon="eye"
            label="View"
            color={Colors.primary}
            onPress={() => { onClose(); onView(); }}
          />
          <ActionItem
            icon="create"
            label="Edit"
            color={Colors.action}
            onPress={() => { onClose(); onEdit(); }}
          />
          <ActionItem
            icon="share"
            label="Share"
            color={Colors.teal}
            onPress={() => { onClose(); onShare(); }}
          />
          <ActionItem
            icon="swap-horizontal"
            label="Convert"
            color={Colors.emerald}
            onPress={() => { onClose(); onConvert(); }}
          />
          <ActionItem
            icon="create"
            label="Sign"
            color={Colors.indigo}
            onPress={() => { onClose(); onSign(); }}
          />

          <View style={styles.divider} />

          <ActionItem
            icon="trash"
            label="Delete"
            color={Colors.danger}
            onPress={() => { onClose(); onDelete(); }}
            isDestructive
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  background: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
  },
  indicator: {
    backgroundColor: Colors.borderSolid,
    width: 40,
  },
  content: {
    flex: 1,
    padding: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  fileName: {
    ...Typography.h3,
    flex: 1,
  },
  fileFormat: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  actions: {
    gap: Spacing.xs,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionLabel: {
    ...Typography.body,
    flex: 1,
  },
  destructiveText: {
    color: Colors.danger,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
});
