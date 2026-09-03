import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { RelatedTools } from '../../components/ui/RelatedTools';

const EDIT_TOOLS = [
  { id: 'text', icon: 'text', label: 'Text' },
  { id: 'image', icon: 'image', label: 'Image' },
  { id: 'draw', icon: 'brush', label: 'Draw' },
  { id: 'shape', icon: 'square', label: 'Shape' },
];

const RELATED_TOOLS = [
  { id: 'merge', icon: 'documents', color: Colors.white, title: 'Merge', route: '/pdf/merge' },
  { id: 'split', icon: 'cut', color: Colors.white, title: 'Split', route: '/pdf/split' },
  { id: 'compress', icon: 'resize', color: Colors.white, title: 'Compress', route: '/pdf/compress' },
  { id: 'sign', icon: 'create', color: Colors.white, title: 'Sign', route: '/pdf/sign' },
];

export default function PDFEditorScreen() {
  const router = useRouter();
  const [hasFile, setHasFile] = useState(false);
  const [activeTool, setActiveTool] = useState('text');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Edit PDF</Text>
          <AnimatedPressable onPress={() => {}} haptic="light" style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
          </AnimatedPressable>
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
            <View style={styles.toolbar}>
              {EDIT_TOOLS.map((tool) => (
                <AnimatedPressable key={tool.id} onPress={() => setActiveTool(tool.id)} haptic="selection" style={[styles.toolBtn, activeTool === tool.id && styles.toolBtnActive]}>
                  <Ionicons name={tool.icon as any} size={18} color={activeTool === tool.id ? Colors.white : Brand.teal} />
                  <Text style={[styles.toolLabel, activeTool === tool.id && styles.toolLabelActive]}>{tool.label}</Text>
                </AnimatedPressable>
              ))}
            </View>
            <View style={styles.canvasArea}>
              <Text style={styles.canvasText}>PDF Preview</Text>
              <Text style={styles.canvasSubtext}>Tap to add {activeTool}</Text>
            </View>
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
  saveBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.2)' },
  saveBtnText: { ...Typography.caption, color: Colors.white, fontWeight: '600' },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginTop: -Spacing.md, ...Shadow.sm },
  uploadArea: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xxl },
  uploadText: { ...Typography.body, fontWeight: '600', color: Brand.teal },
  toolbar: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md, marginTop: -Spacing.md },
  toolBtn: { flex: 1, alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  toolBtnActive: { backgroundColor: Brand.teal, borderColor: Brand.teal },
  toolLabel: { ...Typography.caption, fontWeight: '600', marginTop: Spacing.xs },
  toolLabelActive: { color: Colors.white },
  canvasArea: { backgroundColor: Colors.white, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, height: 300, justifyContent: 'center', alignItems: 'center', ...Shadow.sm },
  canvasText: { ...Typography.h3, color: Colors.textSecondary },
  canvasSubtext: { ...Typography.caption, marginTop: Spacing.sm },
});
