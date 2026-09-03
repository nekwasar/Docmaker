import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useFileStore } from '../../store/file-store';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { SwipeableFileCard } from '../../components/ui/SwipeableFileCard';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { FileActionsSheet } from '../../components/ui/FileActionsSheet';
import { useRouter } from 'expo-router';

const FILTERS = ['All', 'PDF', 'Doc', 'Image', 'Sheet'] as const;

const ALL_TOOLS = [
  { id: 'merge', icon: 'documents', color: Colors.primary, title: 'Merge PDF', route: '/pdf/merge' },
  { id: 'split', icon: 'cut', color: Colors.action, title: 'Split PDF', route: '/pdf/split' },
  { id: 'convert', icon: 'swap-horizontal', color: Colors.emerald, title: 'Convert', route: '/convert' },
  { id: 'compress', icon: 'resize', color: Colors.indigo, title: 'Compress', route: '/pdf/compress' },
  { id: 'sign', icon: 'create', color: Colors.teal, title: 'Sign', route: '/pdf/sign' },
  { id: 'ocr', icon: 'text', color: Colors.amber, title: 'OCR', route: '/camera/ocr' },
  { id: 'encrypt', icon: 'lock-closed', color: Colors.primary, title: 'Encrypt', route: '/pdf/encrypt' },
  { id: 'watermark', icon: 'layers', color: Colors.action, title: 'Watermark', route: '/pdf/watermark' },
  { id: 'rotate', icon: 'refresh', color: Colors.emerald, title: 'Rotate', route: '/pdf/rotate' },
  { id: 'delete', icon: 'trash', color: Colors.danger, title: 'Delete Pages', route: '/pdf/delete-pages' },
  { id: 'extract', icon: 'document', color: Colors.indigo, title: 'Extract Pages', route: '/pdf/extract-pages' },
  { id: 'pdf-edit', icon: 'create', color: Colors.teal, title: 'Edit PDF', route: '/pdf/editor' },
];

export default function FilesScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showActions, setShowActions] = useState(false);
  const [showAllTools, setShowAllTools] = useState(false);
  const { files, isLoading, removeFile } = useFileStore();

  const filteredFiles = files.filter((file) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'PDF') return file.format === 'pdf';
    if (activeFilter === 'Doc') return file.format === 'docx' || file.format === 'txt';
    if (activeFilter === 'Image') return file.format === 'jpg' || file.format === 'png';
    if (activeFilter === 'Sheet') return file.format === 'xlsx' || file.format === 'csv';
    return true;
  });

  const handleFilePress = useCallback((file: any) => {
    setSelectedFile(file);
    setShowActions(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedFile) {
      removeFile(selectedFile.id);
      setShowActions(false);
    }
  }, [selectedFile, removeFile]);

  const displayTools = showAllTools ? ALL_TOOLS : ALL_TOOLS.slice(0, 6);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Files</Text>
        <AnimatedPressable
          onPress={() => {}}
          haptic="light"
          style={styles.searchBtn}
        >
          <Ionicons name="search" size={22} color={Colors.textPrimary} />
        </AnimatedPressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <AnimatedPressable
            onPress={() => router.push('/transfer' as any)}
            haptic="light"
            style={styles.transferCard}
          >
            <View style={styles.transferIcon}>
              <Ionicons name="swap-horizontal" size={24} color={Colors.white} />
            </View>
            <View style={styles.transferInfo}>
              <Text style={styles.transferTitle}>Quick Transfer</Text>
              <Text style={styles.transferSubtitle}>Send files to your computer</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </AnimatedPressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <View style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
              {FILTERS.map((filter) => (
                <AnimatedPressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  haptic="selection"
                  style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
                >
                  <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                    {filter}
                  </Text>
                </AnimatedPressable>
              ))}
            </ScrollView>
          </View>
        </Animated.View>

        {isLoading ? (
          <SkeletonLoader variant="listItem" count={4} />
        ) : filteredFiles.length === 0 ? (
          <EmptyState
            icon="folder-open"
            title="No files yet"
            subtitle="Scan a document or generate one with AI"
            actionLabel="Generate Document"
            onAction={() => router.push('/generate' as any)}
          />
        ) : (
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <View style={styles.fileSection}>
              <Text style={styles.fileSectionTitle}>Recent Files</Text>
              <View style={styles.fileList}>
                {filteredFiles.map((file, index) => (
                  <Animated.View
                    key={file.id}
                    entering={FadeInDown.delay(250 + index * 60).duration(400)}
                  >
                    <SwipeableFileCard
                      file={{
                        id: file.id,
                        name: file.title,
                        format: file.format,
                        date: new Date(file.createdAt).toLocaleDateString(),
                      }}
                      onPress={() => handleFilePress(file)}
                      onShare={() => {}}
                      onFavorite={() => {}}
                      onDelete={() => removeFile(file.id)}
                      onConvert={() => router.push('/convert' as any)}
                    />
                  </Animated.View>
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.toolsSection}>
            <AnimatedPressable
              onPress={() => setShowAllTools(!showAllTools)}
              haptic="light"
              style={styles.toolsHeader}
            >
              <Text style={styles.toolsTitle}>Tools</Text>
              <Ionicons
                name={showAllTools ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.textSecondary}
              />
            </AnimatedPressable>

            {showAllTools && (
              <View style={styles.toolsGrid}>
                {ALL_TOOLS.map((tool) => (
                  <AnimatedPressable
                    key={tool.id}
                    onPress={() => router.push(tool.route as any)}
                    haptic="light"
                    style={styles.toolCard}
                  >
                    <View style={[styles.toolIcon, { backgroundColor: tool.color + '15' }]}>
                      <Ionicons name={tool.icon as any} size={18} color={tool.color} />
                    </View>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                  </AnimatedPressable>
                ))}
              </View>
            )}

            {!showAllTools && (
              <View style={styles.toolsGrid}>
                {displayTools.map((tool) => (
                  <AnimatedPressable
                    key={tool.id}
                    onPress={() => router.push(tool.route as any)}
                    haptic="light"
                    style={styles.toolCard}
                  >
                    <View style={[styles.toolIcon, { backgroundColor: tool.color + '15' }]}>
                      <Ionicons name={tool.icon as any} size={18} color={tool.color} />
                    </View>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                  </AnimatedPressable>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      <AnimatedPressable
        onPress={() => {}}
        haptic="medium"
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </AnimatedPressable>

      <FileActionsSheet
        isVisible={showActions}
        file={selectedFile ? { id: selectedFile.id, name: selectedFile.title, format: selectedFile.format } : null}
        onClose={() => setShowActions(false)}
        onView={() => setShowActions(false)}
        onEdit={() => setShowActions(false)}
        onShare={() => setShowActions(false)}
        onConvert={() => { setShowActions(false); router.push('/convert' as any); }}
        onSign={() => { setShowActions(false); router.push('/pdf/sign' as any); }}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    ...Typography.h1,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
  transferCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadow.md,
  },
  transferIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transferInfo: {
    flex: 1,
  },
  transferTitle: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
  transferSubtitle: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.75)',
  },
  filterRow: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  filterContent: {
    gap: Spacing.sm,
  },
  filterPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.white,
  },
  fileSection: {
    marginTop: Spacing.md,
  },
  fileSectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  fileList: {
    gap: Spacing.sm,
  },
  toolsSection: {
    marginTop: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  toolsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  toolsTitle: {
    ...Typography.h3,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.canvas,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  toolIcon: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTitle: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 11,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.md,
  },
});
