import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useFileStore } from '../../store/file-store';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { BentoCard } from '../../components/ui/BentoCard';
import { SwipeableFileCard } from '../../components/ui/SwipeableFileCard';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { FileActionsSheet } from '../../components/ui/FileActionsSheet';
import { useRouter } from 'expo-router';

const FILTERS = ['All', 'PDF', 'Doc', 'Image', 'Sheet'] as const;

const QUICK_ACTIONS = [
  { id: 'scan', icon: 'camera', color: Colors.amber, title: 'Scan', route: '/camera/scanner' },
  { id: 'ocr', icon: 'text', color: Colors.emerald, title: 'OCR', route: '/camera/ocr' },
  { id: 'merge', icon: 'documents', color: Colors.indigo, title: 'Merge', route: '/pdf/merge' },
  { id: 'sign', icon: 'pen', color: Colors.teal, title: 'Sign', route: '/pdf/sign' },
];

export default function FilesScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showActions, setShowActions] = useState(false);
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

  const getFileStats = () => {
    const pdfCount = files.filter(f => f.format === 'pdf').length;
    const docCount = files.filter(f => f.format === 'docx' || f.format === 'txt').length;
    const imageCount = files.filter(f => f.format === 'jpg' || f.format === 'png').length;
    return { pdfCount, docCount, imageCount, total: files.length };
  };

  const stats = getFileStats();

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
          <View style={styles.bentoGrid}>
            <BentoCard
              variant="wide"
              color={Colors.bentoPrimary}
              icon="folder"
              title="All Files"
              subtitle={`${stats.total} documents`}
              onPress={() => {}}
              badge={{ text: 'Total', color: Colors.action }}
            />
            <View style={styles.bentoRow}>
              <BentoCard
                variant="standard"
                color={Colors.indigo}
                icon="document-text"
                title="PDFs"
                subtitle={`${stats.pdfCount} files`}
                onPress={() => setActiveFilter('PDF')}
              />
              <BentoCard
                variant="standard"
                color={Colors.action}
                icon="document"
                title="Docs"
                subtitle={`${stats.docCount} files`}
                onPress={() => setActiveFilter('Doc')}
              />
            </View>
            <View style={styles.bentoRow}>
              <BentoCard
                variant="standard"
                color={Colors.emerald}
                icon="image"
                title="Images"
                subtitle={`${stats.imageCount} files`}
                onPress={() => setActiveFilter('Image')}
              />
              <BentoCard
                variant="standard"
                color={Colors.teal}
                icon="grid"
                title="Sheets"
                subtitle="0 files"
                onPress={() => setActiveFilter('Sheet')}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickGrid}>
              {QUICK_ACTIONS.map((action) => (
                <AnimatedPressable
                  key={action.id}
                  onPress={() => router.push(action.route as any)}
                  haptic="light"
                  style={styles.quickPill}
                >
                  <View style={[styles.quickIcon, { backgroundColor: action.color + '15' }]}>
                    <Ionicons name={action.icon as any} size={18} color={action.color} />
                  </View>
                  <Text style={styles.quickText}>{action.title}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <Text style={styles.sectionCount}>{filteredFiles.length}</Text>
            </View>

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
          </View>
        </Animated.View>

        {isLoading ? (
          <SkeletonLoader variant="listItem" count={4} />
        ) : filteredFiles.length === 0 ? (
          <EmptyState
            icon="folder-open"
            title="No files yet"
            subtitle="Tap the button below to add your first file"
            actionLabel="Add File"
            onAction={() => {}}
          />
        ) : (
          <View style={styles.fileList}>
            {filteredFiles.map((file, index) => (
              <Animated.View
                key={file.id}
                entering={FadeInDown.delay(400 + index * 80).duration(400)}
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
        )}
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
  bentoGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  bentoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
  },
  sectionCount: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  filterRow: {
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
  fileList: {
    gap: Spacing.sm,
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
