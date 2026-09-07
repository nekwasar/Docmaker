import { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Animated as RNAnimated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { DOCUMENT_TEMPLATES, TEMPLATE_PREVIEWS } from '../../lib/ai/prompts';

const STRUCTURES = ['Auto', 'Invoice', 'Report', 'Contract', 'Proposal', 'Resume', 'Essay', 'Letter', 'Memo', 'Meeting Notes'];

// Quick-field configs per structure
const QUICK_FIELDS: Record<string, { label: string; placeholder: string }[]> = {
  invoice: [
    { label: 'Client Name', placeholder: 'Acme Corp' },
    { label: 'Amount', placeholder: '$1,500' },
    { label: 'Due Date', placeholder: 'Net 30' },
  ],
  contract: [
    { label: 'Party A', placeholder: 'Your Company' },
    { label: 'Party B', placeholder: 'Client Name' },
    { label: 'Duration', placeholder: '12 months' },
  ],
  proposal: [
    { label: 'Project Name', placeholder: 'Website Redesign' },
    { label: 'Budget', placeholder: '$10,000' },
    { label: 'Timeline', placeholder: '6 weeks' },
  ],
  resume: [
    { label: 'Job Title', placeholder: 'Senior Developer' },
    { label: 'Years Experience', placeholder: '5+' },
    { label: 'Industry', placeholder: 'Technology' },
  ],
  letter: [
    { label: 'Recipient', placeholder: 'John Smith' },
    { label: 'Purpose', placeholder: 'Job Application' },
  ],
  meeting_notes: [
    { label: 'Meeting Topic', placeholder: 'Q4 Planning' },
    { label: 'Attendees', placeholder: 'Team Leads' },
  ],
};

export default function GenerateScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [structure, setStructure] = useState('Auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuickFields, setShowQuickFields] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [quickFieldValues, setQuickFieldValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const estimatedPages = text.length > 0 ? Math.max(1, Math.round(text.length / 3000)) : 0;

  const handleTypeSelect = (type: string) => {
    setStructure(type);
    const template = DOCUMENT_TEMPLATES[type.toLowerCase().replace(' ', '_')];
    if (template?.prompt) {
      setText(template.prompt);
    }
    // Show quick-fields if available
    setShowQuickFields(!!QUICK_FIELDS[type.toLowerCase().replace(' ', '_')]);
  };

  const handleTemplateSelect = (template: typeof TEMPLATE_PREVIEWS[0]) => {
    setStructure(template.category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    setText(template.prompt);
    setShowTemplates(false);
    setShowQuickFields(!!QUICK_FIELDS[template.category]);
  };

  const handleGenerate = async () => {
    if (!text.trim() || isGenerating) return;
    setIsGenerating(true);
    setOutput('');

    try {
      const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://docmaker.io';
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, structure: structure.toLowerCase().replace(' ', '_') }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Generation failed');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setOutput((prev) => prev + chunk);
        }
      }

      router.push({ pathname: '/preview', params: { content: output || 'Document generated' } });
    } catch (error: any) {
      setOutput(`[Error: ${error.message}]`);
    } finally {
      setIsGenerating(false);
    }
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

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Document Structure Pills */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.card}>
            <Text style={styles.label}>Document Structure</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
              {STRUCTURES.map((s) => (
                <AnimatedPressable key={s} onPress={() => handleTypeSelect(s)} haptic="selection" style={[styles.pill, structure === s && styles.pillActive]}>
                  <Text style={[styles.pillText, structure === s && styles.pillTextActive]}>{s}</Text>
                </AnimatedPressable>
              ))}
            </ScrollView>
          </View>
        </Animated.View>

        {/* Quick Fields Drawer */}
        {showQuickFields && QUICK_FIELDS[structure.toLowerCase().replace(' ', '_')] && (
          <Animated.View entering={FadeInDown.delay(50).duration(300)} style={styles.quickFieldsCard}>
            <View style={styles.quickFieldsHeader}>
              <Text style={styles.quickFieldsTitle}>Quick Fields</Text>
              <AnimatedPressable onPress={() => setShowQuickFields(false)} haptic="light">
                <Ionicons name="close" size={18} color={Colors.textSecondary} />
              </AnimatedPressable>
            </View>
            {QUICK_FIELDS[structure.toLowerCase().replace(' ', '_')].map((field) => (
              <View key={field.label} style={styles.quickFieldRow}>
                <Text style={styles.quickFieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.quickFieldInput}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.textSecondary}
                  value={quickFieldValues[field.label] || ''}
                  onChangeText={(v) => setQuickFieldValues((prev) => ({ ...prev, [field.label]: v }))}
                />
              </View>
            ))}
          </Animated.View>
        )}

        {/* Main Prompt Card */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <View style={styles.card}>
            <Text style={styles.label}>Describe your document</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Create a professional invoice..."
                placeholderTextColor={Colors.textSecondary}
                value={text}
                onChangeText={setText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              {/* Inline Action Bar */}
              <View style={styles.inlineBar}>
                <AnimatedPressable onPress={() => {}} haptic="light" style={styles.inlineBtn}>
                  <Ionicons name="camera" size={16} color={Brand.navy} />
                  <Text style={styles.inlineBtnText}>Image</Text>
                </AnimatedPressable>
                <AnimatedPressable onPress={() => {}} haptic="light" style={styles.inlineBtn}>
                  <Ionicons name="mic" size={16} color={Brand.navy} />
                  <Text style={styles.inlineBtnText}>Voice</Text>
                </AnimatedPressable>
                <View style={styles.pageEstimate}>
                  <Text style={styles.pageEstimateText}>~{estimatedPages} {estimatedPages === 1 ? 'Page' : 'Pages'} • Formal</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Generate Button */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <AnimatedPressable
            onPress={handleGenerate}
            haptic="medium"
            style={[styles.actionBtn, (!text.trim() || isGenerating) && styles.actionBtnDisabled]}
            disabled={!text.trim() || isGenerating}
          >
            {isGenerating ? (
              <View style={styles.generateContent}>
                <Ionicons name="hourglass" size={20} color={Colors.white} />
                <Text style={styles.actionBtnText}>Generating...</Text>
              </View>
            ) : (
              <View style={styles.generateContent}>
                <Text style={styles.actionBtnText}>Generate Document</Text>
                <Ionicons name="sparkles" size={20} color={Colors.white} />
              </View>
            )}
          </AnimatedPressable>
        </Animated.View>

        {/* Output */}
        {output ? (
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.outputCard}>
            <View style={styles.outputHeader}>
              <Text style={styles.outputTitle}>Generated Document</Text>
            </View>
            <View style={styles.outputContent}>
              <Text style={styles.outputText}>{output}</Text>
            </View>
          </Animated.View>
        ) : null}

        {/* Template Preview Drawer */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <View style={styles.templateSection}>
            <View style={styles.templateHeader}>
              <Text style={styles.sectionTitle}>Or start with a template</Text>
              <AnimatedPressable onPress={() => setShowTemplates(!showTemplates)} haptic="light">
                <Text style={styles.seeAll}>{showTemplates ? 'Show less' : 'See All'}</Text>
              </AnimatedPressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.templateRow}>
                {TEMPLATE_PREVIEWS.slice(0, showTemplates ? TEMPLATE_PREVIEWS.length : 3).map((tpl) => (
                  <AnimatedPressable key={tpl.id} onPress={() => handleTemplateSelect(tpl)} haptic="light" style={styles.templateCard}>
                    <View style={[styles.templateIcon, { backgroundColor: `${tpl.color}15` }]}>
                      <Ionicons name="document-text" size={20} color={tpl.color} />
                    </View>
                    <Text style={styles.templateName}>{tpl.name}</Text>
                    <Text style={styles.templateCategory}>{tpl.category.replace('_', ' ')}</Text>
                  </AnimatedPressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </Animated.View>
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
  textAreaContainer: {},
  textInput: { backgroundColor: Colors.canvas, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg, fontSize: 15, fontWeight: '500', color: Colors.textPrimary, minHeight: 140 },
  inlineBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  inlineBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.sm + 4, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.canvas },
  inlineBtnText: { ...Typography.caption, color: Brand.navy, fontWeight: '600', fontSize: 11 },
  pageEstimate: { marginLeft: 'auto' },
  pageEstimateText: { ...Typography.caption, color: Colors.textSecondary, fontSize: 11 },
  quickFieldsCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginTop: -Spacing.md },
  quickFieldsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  quickFieldsTitle: { ...Typography.body, fontWeight: '600' },
  quickFieldRow: { marginBottom: Spacing.sm },
  quickFieldLabel: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 4 },
  quickFieldInput: { backgroundColor: Colors.canvas, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.sm + 4, fontSize: 14, color: Colors.textPrimary },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Brand.navy, borderRadius: Radius.full, paddingVertical: Spacing.lg, marginBottom: Spacing.xxl, ...Shadow.md },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
  generateContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  outputCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md, overflow: 'hidden' },
  outputHeader: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  outputTitle: { ...Typography.caption, fontWeight: '600' },
  outputContent: { padding: Spacing.xl, maxHeight: 400 },
  outputText: { ...Typography.body, color: Colors.textPrimary, lineHeight: 22 },
  templateSection: { marginTop: Spacing.sm },
  templateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { ...Typography.body, fontWeight: '600' },
  seeAll: { ...Typography.caption, color: Colors.textSecondary },
  templateRow: { flexDirection: 'row', gap: Spacing.sm },
  templateCard: { width: 150, padding: Spacing.md, backgroundColor: Colors.white, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
  templateIcon: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  templateName: { ...Typography.caption, fontWeight: '600' },
  templateCategory: { ...Typography.caption, color: Colors.textSecondary, fontSize: 10, marginTop: 2, textTransform: 'capitalize' },
});
