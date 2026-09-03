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
  { id: 'split', icon: 'cut', color: Colors.white, title: 'Split', route: '/pdf/split' },
  { id: 'compress', icon: 'resize', color: Colors.white, title: 'Compress', route: '/pdf/compress' },
  { id: 'edit', icon: 'create', color: Colors.white, title: 'Edit', route: '/pdf/editor' },
];

export default function SignPDFScreen() {
  const router = useRouter();
  const [hasFile, setHasFile] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Sign Document</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!hasFile ? (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <View style={styles.card}>
              <AnimatedPressable onPress={() => setHasFile(true)} haptic="light" style={styles.uploadArea}>
                <Ionicons name="cloud-upload" size={48} color={Brand.teal} />
                <Text style={styles.uploadText}>Tap to select a document</Text>
              </AnimatedPressable>
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(100).duration(300)}>
            <View style={styles.card}>
              <View style={styles.fileRow}>
                <View style={styles.fileIcon}><Ionicons name="document-text" size={24} color={Brand.teal} /></View>
                <View style={{ flex: 1 }}><Text style={styles.fileName}>contract.pdf</Text><Text style={styles.fileMeta}>3 pages</Text></View>
                <AnimatedPressable onPress={() => setHasFile(false)} haptic="light"><Ionicons name="close-circle" size={20} color={Colors.danger} /></AnimatedPressable>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Your Signature</Text>
              {!hasSignature ? (
                <AnimatedPressable onPress={() => setHasSignature(true)} haptic="light" style={styles.signatureArea}>
                  <Ionicons name="create" size={32} color={Colors.textSecondary} />
                  <Text style={styles.signatureText}>Tap to draw your signature</Text>
                </AnimatedPressable>
              ) : (
                <View style={styles.signaturePreview}><Text style={styles.signaturePreviewText}>John Doe</Text></View>
              )}
            </View>
            <AnimatedPressable onPress={() => {}} haptic="medium" style={[styles.actionBtn, !hasSignature && styles.actionBtnDisabled]} disabled={!hasSignature}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
              <Text style={styles.actionBtnText}>Apply Signature</Text>
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
  signatureArea: { borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', borderRadius: Radius.lg, padding: Spacing.xxl, alignItems: 'center', gap: Spacing.sm },
  signatureText: { ...Typography.body, color: Colors.textSecondary },
  signaturePreview: { backgroundColor: Colors.canvas, borderRadius: Radius.lg, padding: Spacing.xxl, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  signaturePreviewText: { fontSize: 28, fontWeight: '600', fontStyle: 'italic' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Brand.teal, borderRadius: Radius.full, paddingVertical: Spacing.lg, marginBottom: Spacing.xxl, ...Shadow.md },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
