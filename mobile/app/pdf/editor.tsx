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
  { id: 'compress', icon: 'resize', color: Colors.emerald, title: 'Compress', route: '/pdf/compress' },
  { id: 'sign', icon: 'create', color: Colors.indigo, title: 'Sign', route: '/pdf/sign' },
  { id: 'convert', icon: 'swap-horizontal', color: Colors.teal, title: 'Convert', route: '/convert' },
];

const EDIT_TOOLS = [
  { id: 'text', icon: 'text', label: 'Text' },
  { id: 'image', icon: 'image', label: 'Image' },
  { id: 'draw', icon: 'brush', label: 'Draw' },
  { id: 'shape', icon: 'square', label: 'Shape' },
];

export default function PDFEditorScreen() {
  const router = useRouter();
  const [hasFile, setHasFile] = useState(false);
  const [activeTool, setActiveTool] = useState('text');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View style={styles.header}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Edit PDF</Text>
          <AnimatedPressable onPress={() => {}} haptic="light" style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>

      {!hasFile ? (
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <AnimatedPressable onPress={() => setHasFile(true)} haptic="light" style={styles.uploadArea}>
            <Ionicons name="cloud-upload" size={48} color={Colors.textSecondary} />
            <Text style={styles.uploadText}>Tap to select a PDF file</Text>
          </AnimatedPressable>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <View style={styles.toolbar}>
            {EDIT_TOOLS.map((tool) => (
              <AnimatedPressable
                key={tool.id}
                onPress={() => setActiveTool(tool.id)}
                haptic="selection"
                style={[styles.toolBtn, activeTool === tool.id && styles.toolBtnActive]}
              >
                <Ionicons name={tool.icon as any} size={20} color={activeTool === tool.id ? Colors.white : Colors.teal} />
                <Text style={[styles.toolLabel, activeTool === tool.id && styles.toolLabelActive]}>{tool.label}</Text>
              </AnimatedPressable>
            ))}
          </View>

          <View style={styles.canvasArea}>
            <Text style={styles.canvasText}>PDF Preview</Text>
            <Text style={styles.canvasSubtext}>Tap anywhere to add {activeTool}</Text>
          </View>
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
  saveBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.teal },
  saveBtnText: { ...Typography.caption, color: Colors.white, fontWeight: '600' },
  uploadArea: { backgroundColor: Colors.white, borderRadius: Radius.xl, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', padding: Spacing.xxxl, alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl, ...Shadow.sm },
  uploadText: { ...Typography.body, fontWeight: '600' },
  toolbar: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  toolBtn: { flex: 1, alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  toolBtnActive: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  toolLabel: { ...Typography.caption, fontWeight: '600', marginTop: Spacing.xs },
  toolLabelActive: { color: Colors.white },
  canvasArea: { backgroundColor: Colors.white, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, height: 300, justifyContent: 'center', alignItems: 'center', ...Shadow.sm },
  canvasText: { ...Typography.h3, color: Colors.textSecondary },
  canvasSubtext: { ...Typography.caption, marginTop: Spacing.sm },
});
