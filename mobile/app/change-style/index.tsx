import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { RelatedTools } from '../../components/ui/RelatedTools';

const STYLES = [
  { id: 'professional', label: 'Professional', icon: 'briefcase' },
  { id: 'academic', label: 'Academic', icon: 'school' },
  { id: 'creative', label: 'Creative', icon: 'color-palette' },
  { id: 'formal', label: 'Formal', icon: 'document-text' },
  { id: 'casual', label: 'Casual', icon: 'chatbubbles' },
  { id: 'minimal', label: 'Minimal', icon: 'remove-outline' },
];

const RELATED_TOOLS = [
  { id: 'generate', icon: 'sparkles', color: Colors.white, title: 'Generate', route: '/generate' },
  { id: 'edit', icon: 'create', color: Colors.white, title: 'Edit', route: '/edit' },
  { id: 'qa', icon: 'help-circle', color: Colors.white, title: 'Q&A', route: '/qa' },
  { id: 'summarize', icon: 'reader', color: Colors.white, title: 'Summarize', route: '/summarize' },
];

export default function ChangeStyleScreen() {
  const router = useRouter();
  const [hasFile, setHasFile] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Change Style</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!hasFile ? (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <View style={styles.card}>
              <AnimatedPressable onPress={() => setHasFile(true)} haptic="light" style={styles.uploadArea}>
                <Ionicons name="cloud-upload" size={48} color={Brand.navy} />
                <Text style={styles.uploadText}>Tap to select a document</Text>
              </AnimatedPressable>
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(100).duration(300)}>
            <View style={styles.card}>
              <View style={styles.fileRow}>
                <View style={styles.fileIcon}><Ionicons name="document-text" size={24} color={Brand.navy} /></View>
                <View style={{ flex: 1 }}><Text style={styles.fileName}>document.pdf</Text><Text style={styles.fileMeta}>3 pages</Text></View>
                <AnimatedPressable onPress={() => setHasFile(false)} haptic="light"><Ionicons name="close-circle" size={20} color={Colors.danger} /></AnimatedPressable>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Select Style</Text>
              <View style={styles.styleGrid}>
                {STYLES.map((s) => (
                  <AnimatedPressable key={s.id} onPress={() => setSelectedStyle(s.id)} haptic="selection" style={[styles.styleCard, selectedStyle === s.id && styles.styleCardActive]}>
                    <Ionicons name={s.icon as any} size={20} color={selectedStyle === s.id ? Colors.white : Brand.navy} />
                    <Text style={[styles.styleTitle, selectedStyle === s.id && styles.styleTitleActive]}>{s.label}</Text>
                  </AnimatedPressable>
                ))}
              </View>
            </View>
            <AnimatedPressable onPress={() => {}} haptic="medium" style={[styles.actionBtn, (!selectedStyle || isProcessing) && styles.actionBtnDisabled]} disabled={!selectedStyle || isProcessing}>
              <Ionicons name="color-palette" size={20} color={Colors.white} />
              <Text style={styles.actionBtnText}>Apply Style</Text>
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
  header: { backgroundColor: Brand.navy, paddingTop: 60, paddingBottom: Spacing.xxl, borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
  backBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...Typography.h2, color: Colors.white },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginTop: -Spacing.md, ...Shadow.sm },
  uploadArea: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xxl },
  uploadText: { ...Typography.body, fontWeight: '600', color: Brand.navy },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  fileIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Brand.navy + '15', justifyContent: 'center', alignItems: 'center' },
  fileName: { ...Typography.body, fontWeight: '600' },
  fileMeta: { ...Typography.caption },
  label: { ...Typography.body, fontWeight: '600', marginBottom: Spacing.md },
  styleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  styleCard: { width: '31%', alignItems: 'center', backgroundColor: Colors.canvas, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, gap: Spacing.xs },
  styleCardActive: { backgroundColor: Brand.navy, borderColor: Brand.navy },
  styleTitle: { ...Typography.caption, fontWeight: '600' },
  styleTitleActive: { color: Colors.white },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Brand.navy, borderRadius: Radius.full, paddingVertical: Spacing.lg, marginBottom: Spacing.xxl, ...Shadow.md },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
