import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { RelatedTools } from '../../components/ui/RelatedTools';

const RELATED_TOOLS = [
  { id: 'split', icon: 'cut', color: Colors.action, title: 'Split PDF', route: '/pdf/split' },
  { id: 'compress', icon: 'resize', color: Colors.emerald, title: 'Compress', route: '/pdf/compress' },
  { id: 'sign', icon: 'create', color: Colors.indigo, title: 'Sign', route: '/pdf/sign' },
  { id: 'edit', icon: 'create', color: Colors.teal, title: 'Edit PDF', route: '/pdf/editor' },
  { id: 'convert', icon: 'swap-horizontal', color: Colors.primary, title: 'Convert', route: '/convert' },
];

export default function MergePDFScreen() {
  const router = useRouter();
  const [files, setFiles] = useState<string[]>([]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View style={styles.header}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Merge PDF</Text>
          <View style={{ width: 44 }} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(400)}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.primary + '10' }]}>
            <Ionicons name="documents" size={48} color={Colors.primary} />
          </View>
        </View>
        <Text style={styles.subtitle}>Combine multiple PDFs into a single file</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <AnimatedPressable onPress={() => setFiles([...files, `file${files.length + 1}.pdf`])} haptic="light" style={styles.uploadArea}>
          <Ionicons name="add-circle" size={48} color={Colors.primary} />
          <Text style={styles.uploadText}>Tap to add PDF files</Text>
          <Text style={styles.uploadSubtext}>Select 2 or more files to merge</Text>
        </AnimatedPressable>
      </Animated.View>

      {files.length > 0 && (
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.fileList}>
          {files.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <View style={styles.fileIcon}>
                <Ionicons name="document-text" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.fileName}>{file}</Text>
              <AnimatedPressable onPress={() => setFiles(files.filter((_, i) => i !== index))} haptic="light">
                <Ionicons name="close-circle" size={20} color={Colors.danger} />
              </AnimatedPressable>
            </View>
          ))}
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.delay(250).duration(400)}>
        <AnimatedPressable
          onPress={() => {}}
          haptic="medium"
          style={[styles.actionBtn, files.length < 2 && styles.actionBtnDisabled]}
          disabled={files.length < 2}
        >
          <Ionicons name="merge" size={20} color={Colors.white} />
          <Text style={styles.actionBtnText}>Merge {files.length} PDFs</Text>
        </AnimatedPressable>
      </Animated.View>

      <RelatedTools tools={RELATED_TOOLS} onToolPress={(route) => router.push(route as any)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xxl, paddingTop: Spacing.lg },
  backBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', ...Shadow.sm },
  headerTitle: { ...Typography.h2 },
  iconContainer: { alignItems: 'center', marginBottom: Spacing.lg },
  iconCircle: { width: 100, height: 100, borderRadius: Radius.full, justifyContent: 'center', alignItems: 'center' },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xxxl },
  uploadArea: { backgroundColor: Colors.white, borderRadius: Radius.xl, borderWidth: 2, borderColor: Colors.primary + '40', borderStyle: 'dashed', padding: Spacing.xxxl, alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl, ...Shadow.sm },
  uploadText: { ...Typography.body, fontWeight: '600', color: Colors.primary },
  uploadSubtext: { ...Typography.caption },
  fileList: { gap: Spacing.sm, marginBottom: Spacing.xl },
  fileItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  fileIcon: { width: 36, height: 36, borderRadius: Radius.sm, backgroundColor: Colors.primary + '10', justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  fileName: { ...Typography.body, flex: 1 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: Spacing.lg, ...Shadow.md },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
