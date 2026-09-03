import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { RelatedTools } from '../../components/ui/RelatedTools';

const RELATED_TOOLS = [
  { id: 'merge', icon: 'documents', color: Colors.primary, title: 'Merge', route: '/pdf/merge' },
  { id: 'split', icon: 'cut', color: Colors.action, title: 'Split', route: '/pdf/split' },
  { id: 'sign', icon: 'create', color: Colors.indigo, title: 'Sign', route: '/pdf/sign' },
  { id: 'edit', icon: 'create', color: Colors.teal, title: 'Edit PDF', route: '/pdf/editor' },
  { id: 'convert', icon: 'swap-horizontal', color: Colors.emerald, title: 'Convert', route: '/convert' },
];

const LEVELS = [
  { id: 'low', label: 'Low', desc: 'Best quality', icon: 'star' },
  { id: 'medium', label: 'Medium', desc: 'Balanced', icon: 'remove' },
  { id: 'high', label: 'High', desc: 'Smallest file', icon: 'arrow-down' },
];

export default function CompressPDFScreen() {
  const router = useRouter();
  const [hasFile, setHasFile] = useState(false);
  const [level, setLevel] = useState('medium');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View style={styles.header}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Compress PDF</Text>
          <View style={{ width: 44 }} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(400)}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.emerald + '10' }]}>
            <Ionicons name="resize" size={48} color={Colors.emerald} />
          </View>
        </View>
        <Text style={styles.subtitle}>Reduce PDF file size without losing quality</Text>
      </Animated.View>

      {!hasFile ? (
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <AnimatedPressable onPress={() => setHasFile(true)} haptic="light" style={styles.uploadArea}>
            <Ionicons name="cloud-upload" size={48} color={Colors.textSecondary} />
            <Text style={styles.uploadText}>Tap to select a PDF file</Text>
          </AnimatedPressable>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <View style={styles.fileCard}>
            <View style={styles.fileIcon}>
              <Ionicons name="document-text" size={24} color={Colors.emerald} />
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>document.pdf</Text>
              <Text style={styles.fileMeta}>5.2 MB</Text>
            </View>
            <AnimatedPressable onPress={() => setHasFile(false)} haptic="light">
              <Ionicons name="close-circle" size={20} color={Colors.danger} />
            </AnimatedPressable>
          </View>

          <View style={styles.levelSection}>
            <Text style={styles.levelLabel}>Compression Level</Text>
            <View style={styles.levelGrid}>
              {LEVELS.map((l) => (
                <AnimatedPressable
                  key={l.id}
                  onPress={() => setLevel(l.id)}
                  haptic="selection"
                  style={[styles.levelCard, level === l.id && styles.levelCardActive]}
                >
                  <Ionicons name={l.icon as any} size={24} color={level === l.id ? Colors.white : Colors.emerald} />
                  <Text style={[styles.levelTitle, level === l.id && styles.levelTitleActive]}>{l.label}</Text>
                  <Text style={[styles.levelDesc, level === l.id && styles.levelDescActive]}>{l.desc}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </View>

          <AnimatedPressable onPress={() => {}} haptic="medium" style={styles.actionBtn}>
            <Ionicons name="resize" size={20} color={Colors.white} />
            <Text style={styles.actionBtnText}>Compress PDF</Text>
          </AnimatedPressable>
        </Animated.View>
      )}

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
  uploadArea: { backgroundColor: Colors.white, borderRadius: Radius.xl, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', padding: Spacing.xxxl, alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl, ...Shadow.sm },
  uploadText: { ...Typography.body, fontWeight: '600' },
  fileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl, ...Shadow.sm },
  fileIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.emerald + '10', justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  fileInfo: { flex: 1 },
  fileName: { ...Typography.body, fontWeight: '600' },
  fileMeta: { ...Typography.caption },
  levelSection: { marginBottom: Spacing.xl },
  levelLabel: { ...Typography.body, fontWeight: '600', marginBottom: Spacing.md },
  levelGrid: { flexDirection: 'row', gap: Spacing.sm },
  levelCard: { flex: 1, alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, gap: Spacing.xs },
  levelCardActive: { backgroundColor: Colors.emerald, borderColor: Colors.emerald },
  levelTitle: { ...Typography.caption, fontWeight: '700' },
  levelTitleActive: { color: Colors.white },
  levelDesc: { ...Typography.caption, fontSize: 10 },
  levelDescActive: { color: 'rgba(255,255,255,0.8)' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.emerald, borderRadius: Radius.full, paddingVertical: Spacing.lg, ...Shadow.md },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
