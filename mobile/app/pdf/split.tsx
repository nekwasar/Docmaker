import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { RelatedTools } from '../../components/ui/RelatedTools';

const RELATED_TOOLS = [
  { id: 'merge', icon: 'documents', color: Colors.white, title: 'Merge', route: '/pdf/merge' },
  { id: 'compress', icon: 'resize', color: Colors.white, title: 'Compress', route: '/pdf/compress' },
  { id: 'sign', icon: 'create', color: Colors.white, title: 'Sign', route: '/pdf/sign' },
  { id: 'edit', icon: 'create', color: Colors.white, title: 'Edit', route: '/pdf/editor' },
];

export default function SplitPDFScreen() {
  const router = useRouter();
  const [hasFile, setHasFile] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Split PDF</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!hasFile ? (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <View style={styles.card}>
              <AnimatedPressable onPress={() => setHasFile(true)} haptic="light" style={styles.uploadArea}>
                <Ionicons name="cloud-upload" size={48} color={Brand.teal} />
                <Text style={styles.uploadText}>Tap to select a PDF file</Text>
              </AnimatedPressable>
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(100).duration(300)}>
            <View style={styles.card}>
              <View style={styles.fileRow}>
                <View style={styles.fileIcon}><Ionicons name="document-text" size={24} color={Brand.teal} /></View>
                <View style={{ flex: 1 }}><Text style={styles.fileName}>document.pdf</Text><Text style={styles.fileMeta}>5 pages • 2.4 MB</Text></View>
                <AnimatedPressable onPress={() => setHasFile(false)} haptic="light"><Ionicons name="close-circle" size={20} color={Colors.danger} /></AnimatedPressable>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Split Options</Text>
              <AnimatedPressable onPress={() => {}} haptic="selection" style={styles.optionItem}>
                <Ionicons name="list" size={20} color={Brand.teal} />
                <Text style={styles.optionText}>Extract all pages</Text>
                <Ionicons name="checkmark-circle" size={20} color={Brand.teal} />
              </AnimatedPressable>
              <AnimatedPressable onPress={() => {}} haptic="selection" style={styles.optionItem}>
                <Ionicons name="options" size={20} color={Colors.textSecondary} />
                <Text style={[styles.optionText, { color: Colors.textSecondary }]}>Page range</Text>
              </AnimatedPressable>
              <AnimatedPressable onPress={() => {}} haptic="selection" style={styles.optionItem}>
                <Ionicons name="checkbox" size={20} color={Colors.textSecondary} />
                <Text style={[styles.optionText, { color: Colors.textSecondary }]}>Custom pages</Text>
              </AnimatedPressable>
            </View>
            <AnimatedPressable onPress={() => {}} haptic="medium" style={styles.actionBtn}>
              <Ionicons name="cut" size={20} color={Colors.white} />
              <Text style={styles.actionBtnText}>Split PDF</Text>
            </AnimatedPressable>
          </Animated.View>
        )}
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
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  fileIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Brand.teal + '15', justifyContent: 'center', alignItems: 'center' },
  fileName: { ...Typography.body, fontWeight: '600' },
  fileMeta: { ...Typography.caption },
  label: { ...Typography.body, fontWeight: '600', marginBottom: Spacing.md },
  optionItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  optionText: { ...Typography.body, flex: 1 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Brand.teal, borderRadius: Radius.full, paddingVertical: Spacing.lg, marginBottom: Spacing.xxl, ...Shadow.md },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
