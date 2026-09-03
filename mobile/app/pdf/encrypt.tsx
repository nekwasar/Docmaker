import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { RelatedTools } from '../../components/ui/RelatedTools';

const RELATED_TOOLS = [
  { id: 'merge', icon: 'documents', color: Colors.primary, title: 'Merge', route: '/pdf/merge' },
  { id: 'split', icon: 'cut', color: Colors.action, title: 'Split', route: '/pdf/split' },
  { id: 'compress', icon: 'resize', color: Colors.emerald, title: 'Compress', route: '/pdf/compress' },
  { id: 'sign', icon: 'create', color: Colors.indigo, title: 'Sign', route: '/pdf/sign' },
  { id: 'convert', icon: 'swap-horizontal', color: Colors.teal, title: 'Convert', route: '/convert' },
];

export default function EncryptPDFScreen() {
  const router = useRouter();
  const [hasFile, setHasFile] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View style={styles.header}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Encrypt PDF</Text>
          <View style={{ width: 44 }} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(400)}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.primary + '10' }]}>
            <Ionicons name="lock-closed" size={48} color={Colors.primary} />
          </View>
        </View>
        <Text style={styles.subtitle}>Password-protect your PDF documents</Text>
      </Animated.View>

      {!hasFile ? (
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <AnimatedPressable onPress={() => setHasFile(true)} haptic="light" style={styles.uploadArea}>
            <Ionicons name="cloud-upload" size={48} color={Colors.textSecondary} />
            <Text style={styles.uploadText}>Tap to select a PDF file</Text>
          </AnimatedPressable>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <View style={styles.fileCard}>
            <View style={styles.fileIcon}>
              <Ionicons name="document-text" size={24} color={Colors.primary} />
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>document.pdf</Text>
              <Text style={styles.fileMeta}>2.4 MB</Text>
            </View>
            <AnimatedPressable onPress={() => setHasFile(false)} haptic="light">
              <Ionicons name="close-circle" size={20} color={Colors.danger} />
            </AnimatedPressable>
          </View>

          <View style={styles.passwordSection}>
            <Text style={styles.passwordLabel}>Set Password</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <AnimatedPressable onPress={() => setShowPassword(!showPassword)} haptic="light" style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.textSecondary} />
              </AnimatedPressable>
            </View>
          </View>

          <AnimatedPressable onPress={() => {}} haptic="medium" style={[styles.actionBtn, !password && styles.actionBtnDisabled]} disabled={!password}>
            <Ionicons name="lock-closed" size={20} color={Colors.white} />
            <Text style={styles.actionBtnText}>Encrypt PDF</Text>
          </AnimatedPressable>
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
  fileIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.primary + '10', justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  fileInfo: { flex: 1 },
  fileName: { ...Typography.body, fontWeight: '600' },
  fileMeta: { ...Typography.caption },
  passwordSection: { marginBottom: Spacing.xl },
  passwordLabel: { ...Typography.body, fontWeight: '600', marginBottom: Spacing.md },
  passwordInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border },
  input: { flex: 1, padding: Spacing.lg, fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  eyeBtn: { padding: Spacing.lg },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: Spacing.lg, ...Shadow.md },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
