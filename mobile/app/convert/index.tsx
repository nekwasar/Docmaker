import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

const FORMATS = [
  { id: 'pdf', label: 'PDF', icon: 'document-text', color: Colors.indigo },
  { id: 'docx', label: 'DOCX', icon: 'document', color: Colors.action },
  { id: 'jpg', label: 'JPG', icon: 'image', color: Colors.emerald },
  { id: 'png', label: 'PNG', icon: 'image', color: Colors.teal },
  { id: 'xlsx', label: 'XLSX', icon: 'grid', color: Colors.emerald },
  { id: 'csv', label: 'CSV', icon: 'grid', color: Colors.teal },
  { id: 'pptx', icon: 'easel', label: 'PPTX', color: Colors.amber },
  { id: 'txt', label: 'TXT', icon: 'document-outline', color: Colors.textSecondary },
  { id: 'html', label: 'HTML', icon: 'globe', color: Colors.action },
  { id: 'md', label: 'MD', icon: 'reader', color: Colors.primary },
];

export default function ConvertScreen() {
  const router = useRouter();
  const [sourceFormat, setSourceFormat] = useState('');
  const [targetFormat, setTargetFormat] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = () => {
    if (!sourceFormat || !targetFormat) return;
    setIsConverting(true);
    setTimeout(() => setIsConverting(false), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View style={styles.header}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Convert</Text>
          <View style={{ width: 44 }} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(400)}>
        <Text style={styles.label}>From</Text>
        <View style={styles.formatGrid}>
          {FORMATS.map((f) => (
            <AnimatedPressable
              key={f.id}
              onPress={() => setSourceFormat(f.id)}
              haptic="selection"
              style={[styles.formatPill, sourceFormat === f.id && styles.formatPillActive]}
            >
              <Ionicons name={f.icon as any} size={16} color={sourceFormat === f.id ? Colors.white : f.color} />
              <Text style={[styles.formatText, sourceFormat === f.id && styles.formatTextActive]}>{f.label}</Text>
            </AnimatedPressable>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.arrowContainer}>
        <Ionicons name="arrow-down" size={24} color={Colors.textSecondary} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250).duration(400)}>
        <Text style={styles.label}>To</Text>
        <View style={styles.formatGrid}>
          {FORMATS.filter(f => f.id !== sourceFormat).map((f) => (
            <AnimatedPressable
              key={f.id}
              onPress={() => setTargetFormat(f.id)}
              haptic="selection"
              style={[styles.formatPill, targetFormat === f.id && styles.formatPillActive]}
            >
              <Ionicons name={f.icon as any} size={16} color={targetFormat === f.id ? Colors.white : f.color} />
              <Text style={[styles.formatText, targetFormat === f.id && styles.formatTextActive]}>{f.label}</Text>
            </AnimatedPressable>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(400)}>
        <AnimatedPressable onPress={() => {}} haptic="light" style={styles.uploadArea}>
          <Ionicons name="cloud-upload" size={48} color={Colors.textSecondary} />
          <Text style={styles.uploadText}>Select file to convert</Text>
        </AnimatedPressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(350).duration(400)}>
        <AnimatedPressable
          onPress={handleConvert}
          haptic="medium"
          style={[styles.convertBtn, (!sourceFormat || !targetFormat || isConverting) && styles.convertBtnDisabled]}
          disabled={!sourceFormat || !targetFormat || isConverting}
        >
          {isConverting ? (
            <Text style={styles.convertBtnText}>Converting...</Text>
          ) : (
            <>
              <Ionicons name="swap-horizontal" size={20} color={Colors.white} />
              <Text style={styles.convertBtnText}>Convert</Text>
            </>
          )}
        </AnimatedPressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xxl, paddingTop: Spacing.lg },
  backBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', ...Shadow.sm },
  headerTitle: { ...Typography.h2 },
  label: { ...Typography.body, fontWeight: '600', marginBottom: Spacing.md },
  formatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  formatPill: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  formatPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  formatText: { ...Typography.caption, fontWeight: '600' },
  formatTextActive: { color: Colors.white },
  arrowContainer: { alignItems: 'center', marginVertical: Spacing.md },
  uploadArea: { backgroundColor: Colors.white, borderRadius: Radius.xl, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', padding: Spacing.xxxl, alignItems: 'center', gap: Spacing.md, marginTop: Spacing.xxl, marginBottom: Spacing.xxl, ...Shadow.sm },
  uploadText: { ...Typography.body, fontWeight: '600' },
  convertBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: Spacing.lg, ...Shadow.md },
  convertBtnDisabled: { opacity: 0.5 },
  convertBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
