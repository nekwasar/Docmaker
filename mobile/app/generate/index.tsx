import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

const STRUCTURES = [
  { id: 'auto', label: 'Auto' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'report', label: 'Report' },
  { id: 'contract', label: 'Contract' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'resume', label: 'Resume' },
  { id: 'essay', label: 'Essay' },
  { id: 'letter', label: 'Letter' },
  { id: 'memo', label: 'Memo' },
];

export default function GenerateScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [selectedStructure, setSelectedStructure] = useState('auto');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      router.push('/preview' as any);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View style={styles.header}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Generate Document</Text>
          <View style={{ width: 44 }} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(400)}>
        <View style={styles.structureSection}>
          <Text style={styles.label}>Document Structure</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.structureScroll}>
            {STRUCTURES.map((s) => (
              <AnimatedPressable
                key={s.id}
                onPress={() => setSelectedStructure(s.id)}
                haptic="selection"
                style={[styles.structurePill, selectedStructure === s.id && styles.structurePillActive]}
              >
                <Text style={[styles.structureText, selectedStructure === s.id && styles.structureTextActive]}>
                  {s.label}
                </Text>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Describe your document</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Create a professional invoice for web design services totaling $2,500..."
            placeholderTextColor={Colors.textSecondary}
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <View style={styles.inputFooter}>
            <Text style={styles.charCount}>{text.length} characters</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250).duration(400)}>
        <View style={styles.optionsRow}>
          <AnimatedPressable onPress={() => {}} haptic="light" style={styles.optionBtn}>
            <Ionicons name="camera" size={20} color={Colors.primary} />
            <Text style={styles.optionText}>Add Image</Text>
          </AnimatedPressable>
          <AnimatedPressable onPress={() => {}} haptic="light" style={styles.optionBtn}>
            <Ionicons name="mic" size={20} color={Colors.primary} />
            <Text style={styles.optionText}>Voice Input</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(400)}>
        <AnimatedPressable
          onPress={handleGenerate}
          haptic="medium"
          style={[styles.generateBtn, (!text.trim() || isGenerating) && styles.generateBtnDisabled]}
          disabled={!text.trim() || isGenerating}
        >
          {isGenerating ? (
            <Text style={styles.generateBtnText}>Generating...</Text>
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color={Colors.white} />
              <Text style={styles.generateBtnText}>Generate Document</Text>
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
  structureSection: { marginBottom: Spacing.xxl },
  structureScroll: { gap: Spacing.sm },
  structurePill: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  structurePillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  structureText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  structureTextActive: { color: Colors.white },
  inputSection: { marginBottom: Spacing.xxl },
  textInput: { backgroundColor: Colors.white, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg, fontSize: 15, fontWeight: '500', color: Colors.textPrimary, minHeight: 160, ...Shadow.sm },
  inputFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: Spacing.sm },
  charCount: { ...Typography.caption },
  optionsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xxl },
  optionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.white, borderRadius: Radius.xl, paddingVertical: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  optionText: { ...Typography.body, color: Colors.primary, fontWeight: '600' },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: Spacing.lg, ...Shadow.md },
  generateBtnDisabled: { opacity: 0.5 },
  generateBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
