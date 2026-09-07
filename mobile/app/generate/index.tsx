import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { DOCUMENT_TEMPLATES, TEMPLATE_PREVIEWS } from '../../lib/ai/prompts';

const DOC_TYPES = [
  { id: 'auto', label: 'Auto' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'report', label: 'Report' },
  { id: 'contract', label: 'Contract' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'resume', label: 'Resume' },
  { id: 'essay', label: 'Essay' },
  { id: 'letter', label: 'Letter' },
  { id: 'memo', label: 'Memo' },
  { id: 'meeting_notes', label: 'Meeting Notes' },
];

export default function GenerateScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [structure, setStructure] = useState('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [output, setOutput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const estimatedPages = text.length > 0 ? Math.max(1, Math.round(text.length / 3000)) : 0;

  const handleTypeSelect = (typeId: string) => {
    setStructure(typeId);
    const template = DOCUMENT_TEMPLATES[typeId];
    if (template?.prompt) {
      setText(template.prompt);
    }
  };

  const handleTemplateSelect = (template: typeof TEMPLATE_PREVIEWS[0]) => {
    setStructure(template.category);
    setText(template.prompt);
    setShowTemplates(false);
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
        body: JSON.stringify({ text, structure }),
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

      // Navigate to preview with the output
      router.push({ pathname: '/preview', params: { content: output || 'Document generated successfully' } });
    } catch (error: any) {
      setOutput(`[Error: ${error.message}]`);
    } finally {
      setIsGenerating(false);
    }
  };

  const estimatedPages = text.length > 0 ? Math.max(1, Math.round(text.length / 3000)) : 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </AnimatedPressable>
        <Text style={styles.headerTitle}>AI Generate</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Document Type Selector */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={styles.sectionLabel}>Select Document Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
            <View style={styles.pillsRow}>
              {DOC_TYPES.map((type) => (
                <AnimatedPressable
                  key={type.id}
                  onPress={() => handleTypeSelect(type.id)}
                  haptic="selection"
                  style={[
                    styles.pill,
                    structure === type.id && styles.pillActive,
                  ]}
                >
                  <Text style={[
                    styles.pillText,
                    structure === type.id && styles.pillTextActive,
                  ]}>
                    {type.label}
                  </Text>
                </AnimatedPressable>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Main Prompt Card */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.promptCard}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Describe your document or tap a category above..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            style={styles.textInput}
            textAlignVertical="top"
          />

          {/* Bottom toolbar */}
          <View style={styles.toolbar}>
            <View style={styles.toolbarActions}>
              <AnimatedPressable haptic="light" style={styles.toolbarPill}>
                <Ionicons name="attach-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.toolbarPillText}>Attach</Text>
              </AnimatedPressable>
              <AnimatedPressable haptic="light" style={styles.toolbarPill}>
                <Ionicons name="mic-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.toolbarPillText}>Voice</Text>
              </AnimatedPressable>
            </View>
            {estimatedPages > 0 && (
              <Text style={styles.pageEstimate}>~{estimatedPages} {estimatedPages === 1 ? 'Page' : 'Pages'}</Text>
            )}
          </View>
        </Animated.View>

        {/* Generate Button */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <AnimatedPressable
            onPress={handleGenerate}
            disabled={!text.trim() || isGenerating}
            haptic="medium"
            style={[
              styles.generateBtn,
              (!text.trim() || isGenerating) && styles.generateBtnDisabled,
            ]}
          >
            {isGenerating ? (
              <View style={styles.generateBtnContent}>
                <Ionicons name="hourglass" size={20} color={Colors.white} />
                <Text style={styles.generateBtnText}>Generating...</Text>
              </View>
            ) : (
              <View style={styles.generateBtnContent}>
                <Text style={styles.generateBtnText}>Generate Document</Text>
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
              <View style={styles.outputActions}>
                <AnimatedPressable haptic="light" style={styles.outputActionBtn}>
                  <Ionicons name="copy-outline" size={16} color={Colors.textSecondary} />
                </AnimatedPressable>
                <AnimatedPressable haptic="light" style={styles.outputActionBtn}>
                  <Ionicons name="download-outline" size={16} color={Colors.textSecondary} />
                </AnimatedPressable>
              </View>
            </View>
            <ScrollView style={styles.outputScroll}>
              <Text style={styles.outputText}>{output}</Text>
            </ScrollView>
          </Animated.View>
        ) : null}

        {/* Template Preview */}
        <Animated.View entering={FadeInDown.delay(250).duration(400}>
          <View style={styles.templateHeader}>
            <Text style={styles.sectionLabel}>Or start with a template</Text>
            <AnimatedPressable
              onPress={() => setShowTemplates(!showTemplates)}
              haptic="light"
            >
              <Text style={styles.seeAll}>{showTemplates ? 'Show less' : 'See All'}</Text>
            </AnimatedPressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateScroll}>
            <View style={styles.templateRow}>
              {TEMPLATE_PREVIEWS.slice(0, showTemplates ? TEMPLATE_PREVIEWS.length : 3).map((tpl) => (
                <AnimatedPressable
                  key={tpl.id}
                  onPress={() => handleTemplateSelect(tpl)}
                  haptic="light"
                  style={styles.templateCard}
                >
                  <View style={[styles.templateIcon, { backgroundColor: `${tpl.color}15` }]}>
                    <Ionicons name="document-text" size={20} color={tpl.color} />
                  </View>
                  <Text style={styles.templateName}>{tpl.name}</Text>
                  <Text style={styles.templateCategory}>{tpl.category.replace('_', ' ')}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.xl,
    backgroundColor: Colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  sectionLabel: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  pillsScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
  },
  pillActive: {
    backgroundColor: Brand.navy,
    shadowColor: Brand.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pillText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  promptCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSolid,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  textInput: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    ...Typography.body,
    color: Colors.textPrimary,
    minHeight: 120,
    maxHeight: 300,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  toolbarActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  toolbarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
  },
  toolbarPillText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  pageEstimate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  generateBtn: {
    backgroundColor: Brand.navy,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Brand.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  generateBtnDisabled: {
    opacity: 0.5,
  },
  generateBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  generateBtnText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.white,
  },
  outputCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSolid,
    overflow: 'hidden',
  },
  outputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  outputTitle: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  outputActions: {
    flexDirection: 'row',
    gap: 4,
  },
  outputActionBtn: {
    padding: 8,
    borderRadius: Radius.sm,
  },
  outputScroll: {
    maxHeight: 400,
    padding: Spacing.md,
  },
  outputText: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  seeAll: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  templateScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  templateRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  templateCard: {
    width: 150,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderSolid,
  },
  templateIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  templateName: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  templateCategory: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
    textTransform: 'capitalize',
  },
});
