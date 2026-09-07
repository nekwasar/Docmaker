import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { RelatedTools } from '../../components/ui/RelatedTools';

const STRUCTURES = ['Auto', 'Invoice', 'Report', 'Contract', 'Proposal', 'Resume', 'Essay', 'Letter', 'Memo'];

const RELATED_TOOLS = [
  { id: 'edit', icon: 'create', color: Colors.white, title: 'AI Edit', route: '/edit' },
  { id: 'qa', icon: 'help-circle', color: Colors.white, title: 'AI Q&A', route: '/qa' },
  { id: 'summarize', icon: 'reader', color: Colors.white, title: 'Summarize', route: '/summarize' },
  { id: 'style', icon: 'color-palette', color: Colors.white, title: 'Change Style', route: '/change-style' },
];

export default function GenerateScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [structure, setStructure] = useState('Auto');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setTimeout(() => { setIsGenerating(false); router.push('/preview' as any); }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>AI Generate</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.card}>
            <Text style={styles.label}>Document Structure</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
              {STRUCTURES.map((s) => (
                <AnimatedPressable key={s} onPress={() => setStructure(s)} haptic="selection" style={[styles.pill, structure === s && styles.pillActive]}>
                  <Text style={[styles.pillText, structure === s && styles.pillTextActive]}>{s}</Text>
                </AnimatedPressable>
              ))}
            </ScrollView>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <View style={styles.card}>
            <Text style={styles.label}>Describe your document</Text>
            <TextInput style={styles.textInput} placeholder="e.g., Create a professional invoice..." placeholderTextColor={Colors.textSecondary} value={text} onChangeText={setText} multiline numberOfLines={6} textAlignVertical="top" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.optionsRow}>
            <AnimatedPressable onPress={() => {}} haptic="light" style={styles.optionBtn}>
              <Ionicons name="camera" size={20} color={Brand.navy} />
              <Text style={styles.optionText}>Add Image</Text>
            </AnimatedPressable>
            <AnimatedPressable onPress={() => {}} haptic="light" style={styles.optionBtn}>
              <Ionicons name="mic" size={20} color={Brand.navy} />
              <Text style={styles.optionText}>Voice Input</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <AnimatedPressable onPress={handleGenerate} haptic="medium" style={[styles.actionBtn, (!text.trim() || isGenerating) && styles.actionBtnDisabled]} disabled={!text.trim() || isGenerating}>
            {isGenerating ? <Text style={styles.actionBtnText}>Generating...</Text> : <><Ionicons name="sparkles" size={20} color={Colors.white} /><Text style={styles.actionBtnText}>Generate Document</Text></>}
          </AnimatedPressable>
        </Animated.View>

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
  label: { ...Typography.body, fontWeight: '600', marginBottom: Spacing.md },
  pills: { gap: Spacing.sm },
  pill: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.canvas, borderWidth: 1, borderColor: Colors.border },
  pillActive: { backgroundColor: Brand.navy, borderColor: Brand.navy },
  pillText: { ...Typography.caption, fontWeight: '600' },
  pillTextActive: { color: Colors.white },
  textInput: { backgroundColor: Colors.canvas, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg, fontSize: 15, fontWeight: '500', color: Colors.textPrimary, minHeight: 140 },
  optionsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  optionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.white, borderRadius: Radius.xl, paddingVertical: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  optionText: { ...Typography.body, color: Brand.navy, fontWeight: '600' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Brand.navy, borderRadius: Radius.full, paddingVertical: Spacing.lg, marginBottom: Spacing.xxl, ...Shadow.md },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
