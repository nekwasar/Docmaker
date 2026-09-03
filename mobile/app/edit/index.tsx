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
  { id: 'qa', icon: 'help-circle', color: Colors.action, title: 'Q&A', route: '/qa' },
  { id: 'summarize', icon: 'reader', color: Colors.emerald, title: 'Summarize', route: '/summarize' },
  { id: 'style', icon: 'color-palette', color: Colors.indigo, title: 'Change Style', route: '/change-style' },
  { id: 'convert', icon: 'swap-horizontal', color: Colors.teal, title: 'Convert', route: '/convert' },
];

export default function EditScreen() {
  const router = useRouter();
  const [hasFile, setHasFile] = useState(false);
  const [command, setCommand] = useState('');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEdit = () => {
    if (!command.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setResult('Document has been edited based on your command. The changes have been applied successfully.');
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
          <Text style={styles.headerTitle}>AI Edit</Text>
          <View style={{ width: 44 }} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(400)}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.emerald + '10' }]}>
            <Ionicons name="create" size={48} color={Colors.emerald} />
          </View>
        </View>
        <Text style={styles.subtitle}>Edit documents with natural language commands</Text>
      </Animated.View>

      {!hasFile ? (
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <AnimatedPressable onPress={() => setHasFile(true)} haptic="light" style={styles.uploadArea}>
            <Ionicons name="cloud-upload" size={48} color={Colors.textSecondary} />
            <Text style={styles.uploadText}>Tap to select a document</Text>
          </AnimatedPressable>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <View style={styles.fileCard}>
            <View style={styles.fileIcon}>
              <Ionicons name="document-text" size={24} color={Colors.emerald} />
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>report.pdf</Text>
              <Text style={styles.fileMeta}>3 pages</Text>
            </View>
            <AnimatedPressable onPress={() => setHasFile(false)} haptic="light">
              <Ionicons name="close-circle" size={20} color={Colors.danger} />
            </AnimatedPressable>
          </View>

          <View style={styles.commandSection}>
            <Text style={styles.commandLabel}>Edit Command</Text>
            <TextInput
              style={styles.commandInput}
              placeholder='e.g., "Make this more professional" or "Add a conclusion section"'
              placeholderTextColor={Colors.textSecondary}
              value={command}
              onChangeText={setCommand}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <AnimatedPressable
            onPress={handleEdit}
            haptic="medium"
            style={[styles.actionBtn, (!command.trim() || isProcessing) && styles.actionBtnDisabled]}
            disabled={!command.trim() || isProcessing}
          >
            {isProcessing ? (
              <Text style={styles.actionBtnText}>Editing...</Text>
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color={Colors.white} />
                <Text style={styles.actionBtnText}>Apply Edit</Text>
              </>
            )}
          </AnimatedPressable>

          {result ? (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>{result}</Text>
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
  fileIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.emerald + '10', justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  fileInfo: { flex: 1 },
  fileName: { ...Typography.body, fontWeight: '600' },
  fileMeta: { ...Typography.caption },
  commandSection: { marginBottom: Spacing.xl },
  commandLabel: { ...Typography.body, fontWeight: '600', marginBottom: Spacing.md },
  commandInput: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg, fontSize: 15, fontWeight: '500', color: Colors.textPrimary, minHeight: 100, ...Shadow.sm },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.emerald, borderRadius: Radius.full, paddingVertical: Spacing.lg, ...Shadow.md, marginBottom: Spacing.xl },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
  resultBox: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl, ...Shadow.sm },
  resultText: { ...Typography.body, lineHeight: 22, color: Colors.emerald },
});
