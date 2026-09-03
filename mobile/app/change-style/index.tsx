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
  { id: 'summarize', icon: 'reader', color: Colors.amber, title: 'Summarize', route: '/summarize' },
  { id: 'convert', icon: 'swap-horizontal', color: Colors.teal, title: 'Convert', route: '/convert' },
];

const STYLES = [
  { id: 'professional', label: 'Professional', icon: 'briefcase', color: Colors.primary },
  { id: 'academic', label: 'Academic', icon: 'school', color: Colors.action },
  { id: 'creative', label: 'Creative', icon: 'color-palette', color: Colors.indigo },
  { id: 'formal', label: 'Formal', icon: 'document-text', color: Colors.teal },
  { id: 'casual', label: 'Casual', icon: 'chatbubbles', color: Colors.emerald },
  { id: 'minimal', label: 'Minimal', icon: 'remove-outline', color: Colors.textSecondary },
];

export default function ChangeStyleScreen() {
  const router = useRouter();
  const [hasFile, setHasFile] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApply = () => {
    if (!selectedStyle) return;
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View style={styles.header}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Change Style</Text>
          <View style={{ width: 44 }} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(400)}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.indigo + '10' }]}>
            <Ionicons name="color-palette" size={48} color={Colors.indigo} />
          </View>
        </View>
        <Text style={styles.subtitle}>Restyle any document with AI</Text>
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
              <Ionicons name="document-text" size={24} color={Colors.indigo} />
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>document.pdf</Text>
              <Text style={styles.fileMeta}>3 pages</Text>
            </View>
            <AnimatedPressable onPress={() => setHasFile(false)} haptic="light">
              <Ionicons name="close-circle" size={20} color={Colors.danger} />
            </AnimatedPressable>
          </View>

          <View style={styles.styleSection}>
            <Text style={styles.styleLabel}>Select Style</Text>
            <View style={styles.styleGrid}>
              {STYLES.map((s) => (
                <AnimatedPressable
                  key={s.id}
                  onPress={() => setSelectedStyle(s.id)}
                  haptic="selection"
                  style={[styles.styleCard, selectedStyle === s.id && styles.styleCardActive]}
                >
                  <View style={[styles.styleIcon, { backgroundColor: (selectedStyle === s.id ? Colors.white : s.color) + '15' }]}>
                    <Ionicons name={s.icon as any} size={20} color={selectedStyle === s.id ? Colors.white : s.color} />
                  </View>
                  <Text style={[styles.styleTitle, selectedStyle === s.id && styles.styleTitleActive]}>{s.label}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </View>

          <AnimatedPressable
            onPress={handleApply}
            haptic="medium"
            style={[styles.actionBtn, (!selectedStyle || isProcessing) && styles.actionBtnDisabled]}
            disabled={!selectedStyle || isProcessing}
          >
            {isProcessing ? (
              <Text style={styles.actionBtnText}>Applying...</Text>
            ) : (
              <>
                <Ionicons name="color-palette" size={20} color={Colors.white} />
                <Text style={styles.actionBtnText}>Apply Style</Text>
              </>
            )}
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
  fileIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.indigo + '10', justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  fileInfo: { flex: 1 },
  fileName: { ...Typography.body, fontWeight: '600' },
  fileMeta: { ...Typography.caption },
  styleSection: { marginBottom: Spacing.xl },
  styleLabel: { ...Typography.body, fontWeight: '600', marginBottom: Spacing.md },
  styleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  styleCard: { width: '31%', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, gap: Spacing.xs },
  styleCardActive: { backgroundColor: Colors.indigo, borderColor: Colors.indigo },
  styleIcon: { width: 40, height: 40, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  styleTitle: { ...Typography.caption, fontWeight: '600' },
  styleTitleActive: { color: Colors.white },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.indigo, borderRadius: Radius.full, paddingVertical: Spacing.lg, ...Shadow.md },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
