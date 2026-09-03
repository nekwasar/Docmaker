import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { RelatedTools } from '../../components/ui/RelatedTools';

const RELATED_TOOLS = [
  { id: 'generate', icon: 'sparkles', color: Colors.primary, title: 'Generate', route: '/generate' },
  { id: 'edit', icon: 'create', color: Colors.emerald, title: 'Edit', route: '/edit' },
  { id: 'qa', icon: 'help-circle', color: Colors.action, title: 'Q&A', route: '/qa' },
  { id: 'style', icon: 'color-palette', color: Colors.indigo, title: 'Change Style', route: '/change-style' },
  { id: 'convert', icon: 'swap-horizontal', color: Colors.teal, title: 'Convert', route: '/convert' },
];

export default function SummarizeScreen() {
  const router = useRouter();
  const [hasFile, setHasFile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');

  const handleSummarize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setSummary('This document provides a comprehensive overview of the key topics. The main points include project objectives, timeline, budget allocation, and expected outcomes. The document concludes with recommendations for next steps.');
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View style={styles.header}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Summarize</Text>
          <View style={{ width: 44 }} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(400)}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.amber + '10' }]}>
            <Ionicons name="reader" size={48} color={Colors.amber} />
          </View>
        </View>
        <Text style={styles.subtitle}>Create short summaries of long documents</Text>
      </Animated.View>

      {!hasFile ? (
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <AnimatedPressable onPress={() => setHasFile(true)} haptic="light" style={styles.uploadArea}>
            <Ionicons name="cloud-upload" size={48} color={Colors.textSecondary} />
            <Text style={styles.uploadText}>Tap to select a document</Text>
          </AnimatedPressable>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <View style={styles.fileCard}>
            <View style={styles.fileIcon}>
              <Ionicons name="document-text" size={24} color={Colors.amber} />
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>report.pdf</Text>
              <Text style={styles.fileMeta}>10 pages</Text>
            </View>
            <AnimatedPressable onPress={() => setHasFile(false)} haptic="light">
              <Ionicons name="close-circle" size={20} color={Colors.danger} />
            </AnimatedPressable>
          </View>

          <AnimatedPressable
            onPress={handleSummarize}
            haptic="medium"
            style={[styles.actionBtn, isProcessing && styles.actionBtnDisabled]}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Text style={styles.actionBtnText}>Summarizing...</Text>
            ) : (
              <>
                <Ionicons name="reader" size={20} color={Colors.white} />
                <Text style={styles.actionBtnText}>Summarize Document</Text>
              </>
            )}
          </AnimatedPressable>

          {summary ? (
            <View style={styles.summaryBox}>
              <View style={styles.summaryHeader}>
                <Ionicons name="document-text" size={16} color={Colors.amber} />
                <Text style={styles.summaryLabel}>Summary</Text>
              </View>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          ) : null}
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
  fileIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.amber + '10', justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  fileInfo: { flex: 1 },
  fileName: { ...Typography.body, fontWeight: '600' },
  fileMeta: { ...Typography.caption },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.amber, borderRadius: Radius.full, paddingVertical: Spacing.lg, ...Shadow.md, marginBottom: Spacing.xl },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
  summaryBox: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl, ...Shadow.sm },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  summaryLabel: { ...Typography.body, fontWeight: '600', color: Colors.amber },
  summaryText: { ...Typography.body, lineHeight: 22 },
});
