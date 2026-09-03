import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { RelatedTools } from '../../components/ui/RelatedTools';

const RELATED_TOOLS = [
  { id: 'generate', icon: 'sparkles', color: Colors.primary, title: 'Generate', route: '/generate' },
  { id: 'edit', icon: 'create', color: Colors.emerald, title: 'Edit', route: '/edit' },
  { id: 'summarize', icon: 'reader', color: Colors.amber, title: 'Summarize', route: '/summarize' },
  { id: 'style', icon: 'color-palette', color: Colors.indigo, title: 'Change Style', route: '/change-style' },
  { id: 'convert', icon: 'swap-horizontal', color: Colors.teal, title: 'Convert', route: '/convert' },
];

export default function QAScreen() {
  const router = useRouter();
  const [hasFile, setHasFile] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAsk = () => {
    if (!question.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setAnswer('Based on the document, here is the answer to your question. The key information suggests that the document contains relevant details about your query.');
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View style={styles.header}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>AI Q&A</Text>
          <View style={{ width: 44 }} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(400)}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.action + '10' }]}>
            <Ionicons name="help-circle" size={48} color={Colors.action} />
          </View>
        </View>
        <Text style={styles.subtitle}>Ask questions about your documents</Text>
      </Animated.View>

      {!hasFile ? (
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <AnimatedPressable onPress={() => setHasFile(true)} haptic="light" style={styles.uploadArea}>
            <Ionicons name="cloud-upload" size={48} color={Colors.textSecondary} />
            <Text style={styles.uploadText}>Tap to upload a document</Text>
          </AnimatedPressable>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <View style={styles.fileCard}>
            <View style={styles.fileIcon}>
              <Ionicons name="document-text" size={24} color={Colors.action} />
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>contract.pdf</Text>
              <Text style={styles.fileMeta}>5 pages</Text>
            </View>
            <AnimatedPressable onPress={() => setHasFile(false)} haptic="light">
              <Ionicons name="close-circle" size={20} color={Colors.danger} />
            </AnimatedPressable>
          </View>

          <View style={styles.questionSection}>
            <Text style={styles.questionLabel}>Ask a Question</Text>
            <TextInput
              style={styles.questionInput}
              placeholder='e.g., "What are the payment terms?" or "Who are the parties involved?"'
              placeholderTextColor={Colors.textSecondary}
              value={question}
              onChangeText={setQuestion}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <AnimatedPressable
            onPress={handleAsk}
            haptic="medium"
            style={[styles.actionBtn, (!question.trim() || isProcessing) && styles.actionBtnDisabled]}
            disabled={!question.trim() || isProcessing}
          >
            {isProcessing ? (
              <Text style={styles.actionBtnText}>Thinking...</Text>
            ) : (
              <>
                <Ionicons name="help-circle" size={20} color={Colors.white} />
                <Text style={styles.actionBtnText}>Ask Question</Text>
              </>
            )}
          </AnimatedPressable>

          {answer ? (
            <View style={styles.answerBox}>
              <View style={styles.answerHeader}>
                <Ionicons name="chatbubble" size={16} color={Colors.action} />
                <Text style={styles.answerLabel}>Answer</Text>
              </View>
              <Text style={styles.answerText}>{answer}</Text>
            </View>
          ) : null}
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
  iconContainer: { alignItems: 'center', marginBottom: Spacing.lg },
  iconCircle: { width: 100, height: 100, borderRadius: Radius.full, justifyContent: 'center', alignItems: 'center' },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xxxl },
  uploadArea: { backgroundColor: Colors.white, borderRadius: Radius.xl, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', padding: Spacing.xxxl, alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl, ...Shadow.sm },
  uploadText: { ...Typography.body, fontWeight: '600' },
  fileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl, ...Shadow.sm },
  fileIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.action + '10', justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  fileInfo: { flex: 1 },
  fileName: { ...Typography.body, fontWeight: '600' },
  fileMeta: { ...Typography.caption },
  questionSection: { marginBottom: Spacing.xl },
  questionLabel: { ...Typography.body, fontWeight: '600', marginBottom: Spacing.md },
  questionInput: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg, fontSize: 15, fontWeight: '500', color: Colors.textPrimary, minHeight: 100, ...Shadow.sm },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.action, borderRadius: Radius.full, paddingVertical: Spacing.lg, ...Shadow.md, marginBottom: Spacing.xl },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
  answerBox: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl, ...Shadow.sm },
  answerHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  answerLabel: { ...Typography.body, fontWeight: '600', color: Colors.action },
  answerText: { ...Typography.body, lineHeight: 22 },
});
