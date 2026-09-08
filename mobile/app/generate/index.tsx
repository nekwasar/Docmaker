import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Modal, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { RelatedTools } from '../../components/ui/RelatedTools';
import { templates, type Template } from '../../src/data/templates';

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
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const estimatedPages = text.length > 0 ? Math.max(1, Math.round(text.length / 3000)) : 0;

  const handleGenerate = () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setTimeout(() => { setIsGenerating(false); router.push('/preview' as any); }, 2000);
  };

  const useTemplate = (tpl: Template) => {
    setText(tpl.content);
    setPreviewTemplate(null);
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
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Describe or paste what you want to turn into a document — just paste any copied text and we'll format it beautifully..."
                placeholderTextColor={Colors.textSecondary}
                value={text}
                onChangeText={setText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              <View style={styles.inlineBar}>
                <View style={styles.inlineActions}>
                  <View style={styles.inlinePill}>
                    <Ionicons name="attach" size={12} color={Colors.textPrimary} />
                    <Text style={styles.inlinePillText}>Attach</Text>
                  </View>
                  <View style={styles.inlinePill}>
                    <Ionicons name="mic" size={12} color={Colors.textPrimary} />
                    <Text style={styles.inlinePillText}>Voice</Text>
                  </View>
                </View>
                {estimatedPages > 0 ? (
                  <View style={styles.pagePill}>
                    <Text style={styles.pagePillText}>~{estimatedPages} {estimatedPages === 1 ? 'page' : 'pages'}</Text>
                  </View>
                ) : (
                  <Text style={styles.hintText}>Attach files or describe your idea</Text>
                )}
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <AnimatedPressable onPress={handleGenerate} haptic="medium" style={[styles.actionBtn, (!text.trim() || isGenerating) && styles.actionBtnDisabled]} disabled={!text.trim() || isGenerating}>
            {isGenerating ? <Text style={styles.actionBtnText}>Generating...</Text> : <><Ionicons name="sparkles" size={20} color={Colors.white} /><Text style={styles.actionBtnText}>Generate Document</Text></>}
          </AnimatedPressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(280).duration(400)}>
          <View style={styles.templatesHeader}>
            <Text style={styles.label}>Templates</Text>
            <Text style={styles.templatesCount}>{templates.length} curated</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templatesRow}>
            {templates.map((tpl) => (
              <AnimatedPressable key={tpl.id} onPress={() => setPreviewTemplate(tpl)} haptic="light" style={styles.templateCard}>
                <View style={styles.templateThumbRow}>
                  {tpl.thumbnails.slice(0, 2).map((src, i) => (
                    <Image key={src} source={{ uri: src }} style={styles.templateThumb} />
                  ))}
                </View>
                <Text style={styles.templateTitle} numberOfLines={1}>{tpl.title}</Text>
                <View style={styles.templateMeta}>
                  <Ionicons name="person" size={10} color={Colors.textSecondary} />
                  <Text style={styles.templateAuthor} numberOfLines={1}>{tpl.author}</Text>
                  <View style={styles.categoryBadge}><Text style={styles.categoryText}>{tpl.category}</Text></View>
                </View>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </Animated.View>

        <RelatedTools tools={RELATED_TOOLS} onToolPress={(route) => router.push(route as any)} />
      </ScrollView>

      <Modal visible={!!previewTemplate} transparent animationType="fade" onRequestClose={() => setPreviewTemplate(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPreviewTemplate(null)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>{previewTemplate?.title}</Text>
                <View style={styles.modalSubtitleRow}>
                  <Ionicons name="person" size={12} color={Colors.textSecondary} />
                  <Text style={styles.modalSubtitle}>{previewTemplate?.author}</Text>
                  <View style={styles.categoryBadge}><Text style={styles.categoryText}>{previewTemplate?.category}</Text></View>
                </View>
              </View>
              <AnimatedPressable onPress={() => setPreviewTemplate(null)} haptic="light" style={styles.modalClose}>
                <Ionicons name="close" size={16} color={Colors.textSecondary} />
              </AnimatedPressable>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.modalThumbs}>
                {previewTemplate?.thumbnails.map((src, i) => (
                  <View key={i} style={styles.modalThumbWrap}>
                    <Image source={{ uri: src }} style={styles.modalThumb} />
                    <View style={styles.thumbBadge}><Text style={styles.thumbBadgeText}>{i + 1} / {previewTemplate.thumbnails.length}</Text></View>
                  </View>
                ))}
              </View>
              <View style={styles.modalContentBox}>
                <Text style={styles.modalContent}>{previewTemplate?.content}</Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <AnimatedPressable onPress={() => setPreviewTemplate(null)} haptic="light" style={styles.modalSecondaryBtn}>
                <Text style={styles.modalSecondaryText}>Close</Text>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={() => { if (previewTemplate) useTemplate(previewTemplate); }}
                haptic="medium"
                style={styles.modalPrimaryBtn}
              >
                <Text style={styles.modalPrimaryText}>Use this template</Text>
              </AnimatedPressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  inputWrapper: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  textInput: { padding: Spacing.lg, fontSize: 15, fontWeight: '500', color: Colors.textPrimary, minHeight: 140 },
  inlineBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: Colors.border },
  inlineActions: { flexDirection: 'row', gap: Spacing.sm },
  inlinePill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  inlinePillText: { fontSize: 11, fontWeight: '600', color: Colors.textPrimary },
  pagePill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  pagePillText: { fontSize: 11, fontWeight: '500', color: Colors.textSecondary },
  hintText: { fontSize: 11, color: Colors.textSecondary },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Brand.navy, borderRadius: Radius.full, paddingVertical: Spacing.lg, marginBottom: Spacing.xxl, ...Shadow.md },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
  templatesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: Spacing.sm },
  templatesCount: { fontSize: 11, color: Colors.textSecondary },
  templatesRow: { gap: Spacing.sm, paddingRight: Spacing.xl },
  templateCard: { width: 180, backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  templateThumbRow: { flexDirection: 'row', height: 90, backgroundColor: '#F1F5F9' },
  templateThumb: { flex: 1, height: '100%' },
  templateTitle: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary, marginTop: Spacing.sm, paddingHorizontal: Spacing.sm },
  templateAuthor: { fontSize: 10, color: Colors.textSecondary, flex: 1 },
  templateMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.sm, paddingBottom: Spacing.sm, marginTop: 2 },
  categoryBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full },
  categoryText: { fontSize: 9, fontWeight: '600', color: Colors.textSecondary },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.5)', justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  modalCard: { width: '100%', maxWidth: 520, maxHeight: '85%', backgroundColor: Colors.white, borderRadius: Radius.xl, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  modalSubtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  modalSubtitle: { fontSize: 12, color: Colors.textSecondary },
  modalClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.canvas, justifyContent: 'center', alignItems: 'center' },
  modalBody: { padding: Spacing.lg },
  modalThumbs: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  modalThumbWrap: { flex: 1, borderRadius: Radius.md, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, backgroundColor: '#F8FAFC' },
  modalThumb: { width: '100%', height: 110 },
  thumbBadge: { position: 'absolute', bottom: 6, right: 6, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full },
  thumbBadgeText: { fontSize: 9, fontWeight: '600', color: Colors.textPrimary },
  modalContentBox: { backgroundColor: '#F8FAFC', borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, maxHeight: 180 },
  modalContent: { fontSize: 11, color: Colors.textPrimary, lineHeight: 16, fontFamily: 'monospace' },
  modalFooter: { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border },
  modalSecondaryBtn: { flex: 1, paddingVertical: 12, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  modalSecondaryText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  modalPrimaryBtn: { flex: 1, paddingVertical: 12, borderRadius: Radius.lg, backgroundColor: Brand.navy, alignItems: 'center' },
  modalPrimaryText: { fontSize: 14, fontWeight: '600', color: Colors.white },
});
