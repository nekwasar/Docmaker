import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { RelatedTools } from '../../components/ui/RelatedTools';

const RELATED_TOOLS = [
  { id: 'split', icon: 'cut', color: Colors.white, title: 'Split', route: '/pdf/split' },
  { id: 'compress', icon: 'resize', color: Colors.white, title: 'Compress', route: '/pdf/compress' },
  { id: 'sign', icon: 'create', color: Colors.white, title: 'Sign', route: '/pdf/sign' },
  { id: 'edit', icon: 'create', color: Colors.white, title: 'Edit', route: '/pdf/editor' },
];

export default function MergePDFScreen() {
  const router = useRouter();
  const [files, setFiles] = useState<string[]>([]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Merge PDF</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.card}>
            <AnimatedPressable onPress={() => setFiles([...files, `file${files.length + 1}.pdf`])} haptic="light" style={styles.uploadArea}>
              <Ionicons name="add-circle" size={48} color={Brand.teal} />
              <Text style={styles.uploadText}>Tap to add PDF files</Text>
              <Text style={styles.uploadSubtext}>Select 2 or more files to merge</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>

        {files.length > 0 && (
          <Animated.View entering={FadeInDown.delay(100).duration(300)}>
            <View style={styles.card}>
              {files.map((file, index) => (
                <View key={index} style={styles.fileItem}>
                  <View style={styles.fileIcon}><Ionicons name="document-text" size={20} color={Brand.teal} /></View>
                  <Text style={styles.fileName}>{file}</Text>
                  <AnimatedPressable onPress={() => setFiles(files.filter((_, i) => i !== index))} haptic="light"><Ionicons name="close-circle" size={20} color={Colors.danger} /></AnimatedPressable>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        <AnimatedPressable onPress={() => {}} haptic="medium" style={[styles.actionBtn, files.length < 2 && styles.actionBtnDisabled]} disabled={files.length < 2}>
          <Ionicons name="merge" size={20} color={Colors.white} />
          <Text style={styles.actionBtnText}>Merge {files.length} PDFs</Text>
        </AnimatedPressable>

        <RelatedTools tools={RELATED_TOOLS} onToolPress={(route) => router.push(route as any)} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.canvas },
  header: { backgroundColor: Brand.teal, paddingTop: 60, paddingBottom: Spacing.xxl, borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
  backBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...Typography.h2, color: Colors.white },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginTop: -Spacing.md, ...Shadow.sm },
  uploadArea: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xxl },
  uploadText: { ...Typography.body, fontWeight: '600', color: Brand.teal },
  uploadSubtext: { ...Typography.caption },
  fileItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  fileIcon: { width: 36, height: 36, borderRadius: Radius.sm, backgroundColor: Brand.teal + '15', justifyContent: 'center', alignItems: 'center' },
  fileName: { ...Typography.body, flex: 1 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Brand.teal, borderRadius: Radius.full, paddingVertical: Spacing.lg, marginBottom: Spacing.xxl, ...Shadow.md },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
