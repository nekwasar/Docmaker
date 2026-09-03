import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useFileStore } from '../../store/file-store';

const FILTERS = ['All', 'PDF', 'Doc', 'Image', 'Sheet'] as const;

export default function FilesScreen() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const { files, removeFile } = useFileStore();

  const filteredFiles = files.filter((file) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'PDF') return file.format === 'pdf';
    if (activeFilter === 'Doc') return file.format === 'docx' || file.format === 'txt';
    if (activeFilter === 'Image') return file.format === 'jpg' || file.format === 'png';
    if (activeFilter === 'Sheet') return file.format === 'xlsx' || file.format === 'csv';
    return true;
  });

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

  const renderFileCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.fileCard} activeOpacity={0.7}>
      <View style={[styles.fileIcon, { backgroundColor: getFileColor(item.format) + '15' }]}>
        <Ionicons name={getFileIcon(item.format) as any} size={24} color={getFileColor(item.format)} />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.fileMeta}>
          {item.format.toUpperCase()} • {item.wordCount ? `${item.wordCount} words` : 'File'}
        </Text>
      </View>
      <TouchableOpacity style={styles.fileMore} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="ellipsis-horizontal" size={18} color={Colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Docmaker</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredFiles.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="folder-open" size={48} color={Colors.textSecondary} />
          </View>
          <Text style={styles.emptyTitle}>No files yet</Text>
          <Text style={styles.emptySubtitle}>Tap + to add your first file</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFiles}
          renderItem={renderFileCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.fileList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
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
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  filterRow: {
    marginBottom: Spacing.lg,
  },
  filterContent: {
    paddingHorizontal: Spacing.xl,
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
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    paddingBottom: 100,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  fileName: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  fileMeta: {
    ...Typography.caption,
  },
  fileMore: {
    padding: Spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadow.sm,
  },
  emptyTitle: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.caption,
    textAlign: 'center',
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
