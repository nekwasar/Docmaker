import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

export default function OCRScreen() {
  const router = useRouter();
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExtract = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setExtractedText('Sample extracted text from the document. This is a demonstration of the OCR capability.');
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
          <Text style={styles.headerTitle}>Extract Text</Text>
          <View style={{ width: 44 }} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(400)}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="text" size={48} color={Colors.emerald} />
          </View>
        </View>
        <Text style={styles.title}>OCR Text Extraction</Text>
        <Text style={styles.subtitle}>Extract text from images and scanned documents</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <AnimatedPressable onPress={() => router.push('/camera/scanner' as any)} haptic="light" style={styles.uploadArea}>
          <Ionicons name="camera" size={48} color={Colors.textSecondary} />
          <Text style={styles.uploadText}>Take a Photo</Text>
          <Text style={styles.uploadSubtext}>or upload an image</Text>
        </AnimatedPressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250).duration(400)}>
        <AnimatedPressable
          onPress={handleExtract}
          haptic="medium"
          style={[styles.actionBtn, isProcessing && styles.actionBtnDisabled]}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Text style={styles.actionBtnText}>Processing...</Text>
          ) : (
            <>
              <Ionicons name="text" size={20} color={Colors.white} />
              <Text style={styles.actionBtnText}>Extract Text</Text>
            </>
          )}
        </AnimatedPressable>
      </Animated.View>

      {extractedText ? (
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.resultSection}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Extracted Text</Text>
            <AnimatedPressable onPress={() => {}} haptic="light" style={styles.copyBtn}>
              <Ionicons name="copy" size={16} color={Colors.primary} />
              <Text style={styles.copyText}>Copy</Text>
            </AnimatedPressable>
          </View>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{extractedText}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xxl, paddingTop: Spacing.lg },
  backBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', ...Shadow.sm },
  headerTitle: { ...Typography.h2 },
  iconContainer: { alignItems: 'center', marginBottom: Spacing.xxl },
  iconCircle: { width: 100, height: 100, borderRadius: Radius.full, backgroundColor: Colors.emerald + '10', justifyContent: 'center', alignItems: 'center' },
  title: { ...Typography.h1, textAlign: 'center', marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xxxl },
  uploadArea: { backgroundColor: Colors.white, borderRadius: Radius.xl, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', padding: Spacing.xxxl, alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xxl, ...Shadow.sm },
  uploadText: { ...Typography.body, fontWeight: '600' },
  uploadSubtext: { ...Typography.caption },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.emerald, borderRadius: Radius.full, paddingVertical: Spacing.lg, ...Shadow.md },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
  resultSection: { marginTop: Spacing.xxl },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  resultTitle: { ...Typography.h3 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  copyText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
  resultBox: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  resultText: { ...Typography.body, lineHeight: 22 },
});
