import { View, Text, StyleSheet, ScrollView } from 'react-native';
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
  { id: 'edit', icon: 'create', color: Colors.teal, title: 'Edit PDF', route: '/pdf/editor' },
  { id: 'convert', icon: 'swap-horizontal', color: Colors.indigo, title: 'Convert', route: '/convert' },
];

export default function SignPDFScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="create" size={48} color={Colors.indigo} />
          </View>
        </View>
        <Text style={styles.title}>Sign Document</Text>
        <Text style={styles.subtitle}>Add your digital signature to any document</Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <AnimatedPressable onPress={() => {}} haptic="light" style={styles.uploadArea}>
          <Ionicons name="cloud-upload" size={48} color={Colors.textSecondary} />
          <Text style={styles.uploadText}>Tap to select a document</Text>
        </AnimatedPressable>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(300).duration(400)}>
        <AnimatedPressable onPress={() => {}} haptic="medium" style={styles.actionBtn} disabled>
          <Text style={styles.actionBtnText}>Sign Document</Text>
        </AnimatedPressable>
      </Animated.View>
      <RelatedTools tools={RELATED_TOOLS} onToolPress={(route) => router.push(route as any)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  iconContainer: { alignItems: 'center', marginBottom: Spacing.xxl },
  iconCircle: { width: 100, height: 100, borderRadius: Radius.full, backgroundColor: Colors.indigo + '10', justifyContent: 'center', alignItems: 'center' },
  title: { ...Typography.h1, textAlign: 'center', marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xxxl },
  uploadArea: { backgroundColor: Colors.white, borderRadius: Radius.xl, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', padding: Spacing.xxxl, alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xxl },
  uploadText: { ...Typography.body, fontWeight: '600' },
  actionBtn: { backgroundColor: Colors.indigo, borderRadius: Radius.full, paddingVertical: Spacing.lg, alignItems: 'center', ...Shadow.md },
  actionBtnText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
});
