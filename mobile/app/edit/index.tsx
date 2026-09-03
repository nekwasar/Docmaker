import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { RelatedTools } from '../../components/ui/RelatedTools';

const RELATED_TOOLS = [
  { id: 'generate', icon: 'sparkles', color: Colors.white, title: 'Generate', route: '/generate' },
  { id: 'qa', icon: 'help-circle', color: Colors.white, title: 'Q&A', route: '/qa' },
  { id: 'summarize', icon: 'reader', color: Colors.white, title: 'Summarize', route: '/summarize' },
  { id: 'style', icon: 'color-palette', color: Colors.white, title: 'Change Style', route: '/change-style' },
];

export default function EditScreen() {
  const router = useRouter();
  const [hasFile, setHasFile] = useState(false);
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEdit = () => {
    if (!command.trim()) return;
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>AI Edit</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!hasFile ? (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <View style={styles.card}>
              <AnimatedPressable onPress={() => setHasFile(true)} haptic="light" style={styles.uploadArea}>
                <Ionicons name="cloud-upload" size={48} color={Brand.navy} />
                <Text style={styles.uploadText}>Tap to select a document</Text>
              </AnimatedPressable>
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(100).duration(300)}>
            <View style={styles.card}>
              <View style={styles.fileRow}>
                <View style={styles.fileIcon}><Ionicons name="document-text" size={24} color={Brand.navy} /></View>
                <View style={{ flex: 1 }}><Text style={styles.fileName}>report.pdf</Text><Text style={styles.fileMeta}>3 pages</Text></View>
                <AnimatedPressable onPress={() => setHasFile(false)} haptic="light"><Ionicons name="close-circle" size={20} color={Colors.danger} /></AnimatedPressable>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Edit Command</Text>
              <TextInput style={styles.textInput} placeholder='e.g., "Make this more professional"' placeholderTextColor={Colors.textSecondary} value={command} onChangeText={setCommand} multiline numberOfLines={3} textAlignVertical="top" />
            </View>
            <AnimatedPressable onPress={handleEdit} haptic="medium" style={[styles.actionBtn, (!command.trim() || isProcessing) && styles.actionBtnDisabled]} disabled={!command.trim() || isProcessing}>
              {isProcessing ? <Text style={styles.actionBtnText}>Editing...</Text> : <><Ionicons name="sparkles" size={20} color={Colors.white} /><Text style={styles.actionBtnText}>Apply Edit</Text></>}
            </AnimatedPressable>
          </Animated.View>
        )}
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
  uploadArea: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xxl },
  uploadText: { ...Typography.body, fontWeight: '600', color: Brand.navy },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  fileIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Brand.navy + '15', justifyContent: 'center', alignItems: 'center' },
  fileName: { ...Typography.body, fontWeight: '600' },
  fileMeta: { ...Typography.caption },
  label: { ...Typography.body, fontWeight: '600', marginBottom: Spacing.md },
  textInput: { backgroundColor: Colors.canvas, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg, fontSize: 15, fontWeight: '500', color: Colors.textPrimary, minHeight: 100 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Brand.navy, borderRadius: Radius.full, paddingVertical: Spacing.lg, marginBottom: Spacing.xxl, ...Shadow.md },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
