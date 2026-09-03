import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

export default function OCRScreen() {
  const router = useRouter();
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExtract = () => {
    setIsProcessing(true);
    setTimeout(() => { setExtractedText('Sample extracted text from the document.'); setIsProcessing(false); }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>OCR</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.card}>
            <AnimatedPressable onPress={() => router.push('/camera/scanner' as any)} haptic="light" style={styles.uploadArea}>
              <Ionicons name="camera" size={48} color={Brand.yellow} />
              <Text style={styles.uploadText}>Take a Photo</Text>
              <Text style={styles.uploadSubtext}>or upload an image</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>

        <AnimatedPressable onPress={handleExtract} haptic="medium" style={[styles.actionBtn, isProcessing && styles.actionBtnDisabled]} disabled={isProcessing}>
          {isProcessing ? <Text style={styles.actionBtnText}>Processing...</Text> : <><Ionicons name="text" size={20} color={Colors.textPrimary} /><Text style={styles.actionBtnText}>Extract Text</Text></>}
        </AnimatedPressable>

        {extractedText ? (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <View style={styles.card}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Extracted Text</Text>
                <AnimatedPressable onPress={() => {}} haptic="light" style={styles.copyBtn}>
                  <Ionicons name="copy" size={16} color={Brand.yellow} />
                  <Text style={styles.copyText}>Copy</Text>
                </AnimatedPressable>
              </View>
              <View style={styles.resultBox}><Text style={styles.resultText}>{extractedText}</Text></View>
            </View>
          </Animated.View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.canvas },
  header: { backgroundColor: Brand.yellow, paddingTop: 60, paddingBottom: Spacing.xxl, borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
  backBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...Typography.h2, color: Colors.textPrimary },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginTop: -Spacing.md, ...Shadow.sm },
  uploadArea: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xxl },
  uploadText: { ...Typography.body, fontWeight: '600', color: Brand.yellow },
  uploadSubtext: { ...Typography.caption },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Brand.yellow, borderRadius: Radius.full, paddingVertical: Spacing.lg, marginBottom: Spacing.xxl, ...Shadow.md },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.textPrimary, fontWeight: '600' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  resultTitle: { ...Typography.body, fontWeight: '600' },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  copyText: { ...Typography.caption, color: Brand.yellow, fontWeight: '600' },
  resultBox: { backgroundColor: Colors.canvas, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  resultText: { ...Typography.body, lineHeight: 22 },
});
