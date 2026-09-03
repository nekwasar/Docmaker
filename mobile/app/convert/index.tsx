import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

const FORMATS = [
  { id: 'pdf', label: 'PDF', icon: 'document-text' },
  { id: 'docx', label: 'DOCX', icon: 'document' },
  { id: 'jpg', label: 'JPG', icon: 'image' },
  { id: 'png', label: 'PNG', icon: 'image' },
  { id: 'xlsx', label: 'XLSX', icon: 'grid' },
  { id: 'csv', label: 'CSV', icon: 'grid' },
  { id: 'pptx', label: 'PPTX', icon: 'easel' },
  { id: 'txt', label: 'TXT', icon: 'document-outline' },
  { id: 'html', label: 'HTML', icon: 'globe' },
  { id: 'md', label: 'MD', icon: 'reader' },
];

export default function ConvertScreen() {
  const router = useRouter();
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = () => {
    if (!source || !target) return;
    setIsConverting(true);
    setTimeout(() => setIsConverting(false), 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Convert</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.card}>
            <Text style={styles.label}>From</Text>
            <View style={styles.formatGrid}>
              {FORMATS.map((f) => (
                <AnimatedPressable key={f.id} onPress={() => setSource(f.id)} haptic="selection" style={[styles.formatPill, source === f.id && styles.formatPillActive]}>
                  <Ionicons name={f.icon as any} size={14} color={source === f.id ? Colors.white : Brand.blue} />
                  <Text style={[styles.formatText, source === f.id && styles.formatTextActive]}>{f.label}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.arrowContainer}>
          <Ionicons name="arrow-down" size={24} color={Colors.textSecondary} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.card}>
            <Text style={styles.label}>To</Text>
            <View style={styles.formatGrid}>
              {FORMATS.filter(f => f.id !== source).map((f) => (
                <AnimatedPressable key={f.id} onPress={() => setTarget(f.id)} haptic="selection" style={[styles.formatPill, target === f.id && styles.formatPillActive]}>
                  <Ionicons name={f.icon as any} size={14} color={target === f.id ? Colors.white : Brand.blue} />
                  <Text style={[styles.formatText, target === f.id && styles.formatTextActive]}>{f.label}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <View style={styles.card}>
            <AnimatedPressable onPress={() => {}} haptic="light" style={styles.uploadArea}>
              <Ionicons name="cloud-upload" size={48} color={Brand.blue} />
              <Text style={styles.uploadText}>Select file to convert</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>

        <AnimatedPressable onPress={handleConvert} haptic="medium" style={[styles.actionBtn, (!source || !target || isConverting) && styles.actionBtnDisabled]} disabled={!source || !target || isConverting}>
          {isConverting ? <Text style={styles.actionBtnText}>Converting...</Text> : <><Ionicons name="swap-horizontal" size={20} color={Colors.white} /><Text style={styles.actionBtnText}>Convert</Text></>}
        </AnimatedPressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.canvas },
  header: { backgroundColor: Brand.blue, paddingTop: 60, paddingBottom: Spacing.xxl, borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
  backBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...Typography.h2, color: Colors.white },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginTop: -Spacing.md, ...Shadow.sm },
  label: { ...Typography.body, fontWeight: '600', marginBottom: Spacing.md },
  formatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  formatPill: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.canvas, borderWidth: 1, borderColor: Colors.border },
  formatPillActive: { backgroundColor: Brand.blue, borderColor: Brand.blue },
  formatText: { ...Typography.caption, fontWeight: '600' },
  formatTextActive: { color: Colors.white },
  arrowContainer: { alignItems: 'center', marginVertical: Spacing.sm },
  uploadArea: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xxl },
  uploadText: { ...Typography.body, fontWeight: '600', color: Brand.blue },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Brand.blue, borderRadius: Radius.full, paddingVertical: Spacing.lg, marginBottom: Spacing.xxl, ...Shadow.md },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
