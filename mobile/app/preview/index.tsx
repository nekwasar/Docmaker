import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

export default function PreviewScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Preview</Text>
          <AnimatedPressable onPress={() => {}} haptic="light" style={styles.editBtn}>
            <Ionicons name="create" size={18} color={Colors.white} />
            <Text style={styles.editBtnText}>Edit</Text>
          </AnimatedPressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.card}>
            <Text style={styles.docTitle}>Generated Document</Text>
            <View style={styles.docSection}>
              <Text style={styles.docHeading}>Introduction</Text>
              <Text style={styles.docText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
            </View>
            <View style={styles.docSection}>
              <Text style={styles.docHeading}>Main Content</Text>
              <Text style={styles.docText}>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
            </View>
            <View style={styles.docSection}>
              <Text style={styles.docHeading}>Conclusion</Text>
              <Text style={styles.docText}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.bottomBar}>
        <AnimatedPressable onPress={() => {}} haptic="light" style={styles.bottomBtn}>
          <Ionicons name="download" size={20} color={Brand.navy} />
          <Text style={styles.bottomBtnText}>PDF</Text>
        </AnimatedPressable>
        <AnimatedPressable onPress={() => {}} haptic="light" style={styles.bottomBtn}>
          <Ionicons name="document" size={20} color={Brand.navy} />
          <Text style={styles.bottomBtnText}>DOCX</Text>
        </AnimatedPressable>
        <AnimatedPressable onPress={() => {}} haptic="light" style={styles.bottomBtn}>
          <Ionicons name="document-outline" size={20} color={Brand.navy} />
          <Text style={styles.bottomBtnText}>TXT</Text>
        </AnimatedPressable>
        <AnimatedPressable onPress={() => {}} haptic="light" style={[styles.bottomBtn, styles.bottomBtnPrimary]}>
          <Ionicons name="share" size={20} color={Colors.white} />
          <Text style={[styles.bottomBtnText, { color: Colors.white }]}>Share</Text>
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.canvas },
  header: { backgroundColor: Brand.navy, paddingTop: 60, paddingBottom: Spacing.lg, borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
  backBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...Typography.h2, color: Colors.white },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.2)' },
  editBtnText: { ...Typography.caption, color: Colors.white, fontWeight: '600' },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border, marginTop: -Spacing.md, ...Shadow.sm },
  docTitle: { ...Typography.h1, marginBottom: Spacing.xxl, textAlign: 'center' },
  docSection: { marginBottom: Spacing.xl },
  docHeading: { ...Typography.h3, marginBottom: Spacing.sm },
  docText: { ...Typography.body, lineHeight: 24, color: Colors.textSecondary },
  bottomBar: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.white },
  bottomBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, backgroundColor: Colors.white, borderRadius: Radius.full, paddingVertical: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  bottomBtnPrimary: { backgroundColor: Brand.navy, borderColor: Brand.navy },
  bottomBtnText: { ...Typography.caption, fontWeight: '600', color: Brand.navy },
});
