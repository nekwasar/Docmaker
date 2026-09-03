import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

export default function ScannerScreen() {
  const router = useRouter();
  const [hasCapture, setHasCapture] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Scanner</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <View style={styles.cameraArea}>
        <View style={styles.cameraPlaceholder}>
          <Ionicons name="camera" size={64} color={Colors.textSecondary} />
          <Text style={styles.cameraText}>Camera Preview</Text>
          <Text style={styles.cameraSubtext}>Point at a document</Text>
        </View>
        <View style={styles.scanOverlay}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      <View style={styles.controls}>
        <AnimatedPressable onPress={() => {}} haptic="light" style={styles.galleryBtn}>
          <Ionicons name="images" size={24} color={Colors.textPrimary} />
        </AnimatedPressable>
        <AnimatedPressable onPress={() => setHasCapture(true)} haptic="heavy" style={styles.captureBtn}>
          <View style={styles.captureBtnInner} />
        </AnimatedPressable>
        <AnimatedPressable onPress={() => {}} haptic="light" style={styles.flashBtn}>
          <Ionicons name="flash" size={24} color={Colors.textPrimary} />
        </AnimatedPressable>
      </View>

      {hasCapture && (
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.actionBar}>
          <AnimatedPressable onPress={() => setHasCapture(false)} haptic="light" style={styles.actionBtn}>
            <Ionicons name="refresh" size={20} color={Colors.textPrimary} />
            <Text style={styles.actionText}>Retake</Text>
          </AnimatedPressable>
          <AnimatedPressable onPress={() => router.push('/camera/ocr' as any)} haptic="medium" style={[styles.actionBtn, styles.actionBtnPrimary]}>
            <Ionicons name="checkmark" size={20} color={Colors.white} />
            <Text style={[styles.actionText, { color: Colors.white }]}>Use Photo</Text>
          </AnimatedPressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { backgroundColor: Brand.yellow, paddingTop: 60, paddingBottom: Spacing.xl },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
  backBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...Typography.h2, color: Colors.textPrimary },
  cameraArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cameraPlaceholder: { width: '85%', height: '70%', backgroundColor: '#1a1a1a', borderRadius: Radius.xl, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  cameraText: { ...Typography.h3, color: Colors.textSecondary },
  cameraSubtext: { ...Typography.caption, color: Colors.textSecondary },
  scanOverlay: { position: 'absolute', width: '80%', height: '60%' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: Brand.yellow },
  topLeft: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  topRight: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  controls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: Spacing.xxxl, paddingBottom: Spacing.xxxl },
  galleryBtn: { width: 56, height: 56, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  captureBtn: { width: 80, height: 80, borderRadius: Radius.full, borderWidth: 4, borderColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  captureBtnInner: { width: 64, height: 64, borderRadius: Radius.full, backgroundColor: Colors.white },
  flashBtn: { width: 56, height: 56, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  actionBar: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.lg, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxxl },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.2)' },
  actionBtnPrimary: { backgroundColor: Brand.yellow },
  actionText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
