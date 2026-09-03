import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { BentoCard } from '../../components/ui/BentoCard';

const MOBILE_TOOLS = [
  { id: 'scan', icon: 'camera', color: Colors.amber, title: 'Scan', subtitle: 'Scan documents', route: '/camera/scanner' },
  { id: 'ocr', icon: 'text', color: Colors.emerald, title: 'OCR', subtitle: 'Extract text', route: '/camera/ocr' },
  { id: 'sign', icon: 'create', color: Colors.indigo, title: 'Sign', subtitle: 'Sign documents', route: '/pdf/sign' },
  { id: 'transfer', icon: 'swap-horizontal', color: Colors.teal, title: 'Transfer', subtitle: 'Send files', route: '/transfer' },
];

const AI_TOOLS = [
  { id: 'generate', icon: 'document-text', color: Colors.primary, title: 'AI Generate', route: '/generate' },
  { id: 'summarize', icon: 'reader', color: Colors.amber, title: 'Summarize', route: '/summarize' },
  { id: 'qa', icon: 'help-circle', color: Colors.action, title: 'AI Q&A', route: '/qa' },
  { id: 'style', icon: 'color-palette', color: Colors.indigo, title: 'Change Style', route: '/change-style' },
  { id: 'edit', icon: 'create', color: Colors.emerald, title: 'AI Edit', route: '/edit' },
];

const PDF_TOOLS = [
  { id: 'merge', icon: 'documents', color: Colors.primary, title: 'Merge PDF', route: '/pdf/merge' },
  { id: 'split', icon: 'cut', color: Colors.action, title: 'Split PDF', route: '/pdf/split' },
  { id: 'compress', icon: 'resize', color: Colors.emerald, title: 'Compress', route: '/pdf/compress' },
  { id: 'pdf-edit', icon: 'create', color: Colors.indigo, title: 'Edit PDF', route: '/pdf/editor' },
  { id: 'encrypt', icon: 'lock-closed', color: Colors.teal, title: 'Encrypt', route: '/pdf/encrypt' },
  { id: 'watermark', icon: 'layers', color: Colors.amber, title: 'Watermark', route: '/pdf/watermark' },
];

const CONVERT_TOOLS = [
  { id: 'pdf-word', icon: 'document-text', color: Colors.action, title: 'PDF → Word', route: '/convert' },
  { id: 'jpg-pdf', icon: 'image', color: Colors.emerald, title: 'JPG → PDF', route: '/convert' },
  { id: 'all-convert', icon: 'swap-horizontal', color: Colors.primary, title: 'All Formats', route: '/convert' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Docmaker</Text>
        <AnimatedPressable
          onPress={() => {}}
          haptic="light"
          style={styles.searchBtn}
        >
          <Ionicons name="search" size={22} color={Colors.textPrimary} />
        </AnimatedPressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <BentoCard
            variant="hero"
            color={Colors.bentoPrimary}
            icon="sparkles"
            title="AI Generate"
            subtitle="Create professional documents from text prompts"
            onPress={() => router.push('/generate' as any)}
            badge={{ text: 'AI', color: Colors.action }}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.mobileGrid}>
              {MOBILE_TOOLS.map((tool) => (
                <AnimatedPressable
                  key={tool.id}
                  onPress={() => router.push(tool.route as any)}
                  haptic="light"
                  style={styles.mobileCard}
                >
                  <View style={[styles.mobileIcon, { backgroundColor: tool.color + '15' }]}>
                    <Ionicons name={tool.icon as any} size={24} color={tool.color} />
                  </View>
                  <Text style={styles.mobileTitle}>{tool.title}</Text>
                  <Text style={styles.mobileSubtitle}>{tool.subtitle}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI Tools</Text>
              <AnimatedPressable onPress={() => {}} haptic="light">
                <Text style={styles.seeAll}>See All</Text>
              </AnimatedPressable>
            </View>
            <View style={styles.aiGrid}>
              {AI_TOOLS.map((tool) => (
                <AnimatedPressable
                  key={tool.id}
                  onPress={() => router.push(tool.route as any)}
                  haptic="light"
                  style={styles.aiCard}
                >
                  <View style={[styles.aiIcon, { backgroundColor: tool.color + '15' }]}>
                    <Ionicons name={tool.icon as any} size={20} color={tool.color} />
                  </View>
                  <Text style={styles.aiTitle}>{tool.title}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>PDF Tools</Text>
              <AnimatedPressable onPress={() => {}} haptic="light">
                <Text style={styles.seeAll}>See All</Text>
              </AnimatedPressable>
            </View>
            <View style={styles.pdfGrid}>
              {PDF_TOOLS.map((tool) => (
                <AnimatedPressable
                  key={tool.id}
                  onPress={() => router.push(tool.route as any)}
                  haptic="light"
                  style={styles.pdfCard}
                >
                  <View style={[styles.pdfIcon, { backgroundColor: tool.color + '15' }]}>
                    <Ionicons name={tool.icon as any} size={18} color={tool.color} />
                  </View>
                  <Text style={styles.pdfTitle}>{tool.title}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Convert</Text>
              <AnimatedPressable onPress={() => router.push('/convert' as any)} haptic="light">
                <Text style={styles.seeAll}>See All</Text>
              </AnimatedPressable>
            </View>
            <View style={styles.convertGrid}>
              {CONVERT_TOOLS.map((tool) => (
                <AnimatedPressable
                  key={tool.id}
                  onPress={() => router.push(tool.route as any)}
                  haptic="light"
                  style={styles.convertCard}
                >
                  <View style={[styles.convertIcon, { backgroundColor: tool.color + '15' }]}>
                    <Ionicons name={tool.icon as any} size={20} color={tool.color} />
                  </View>
                  <Text style={styles.convertTitle}>{tool.title}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    ...Typography.h1,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
  section: {
    marginTop: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
  },
  seeAll: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  mobileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  mobileCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  mobileIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileTitle: {
    ...Typography.body,
    fontWeight: '600',
  },
  mobileSubtitle: {
    ...Typography.caption,
  },
  aiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  aiIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTitle: {
    ...Typography.caption,
    fontWeight: '600',
  },
  pdfGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  pdfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  pdfIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfTitle: {
    ...Typography.caption,
    fontWeight: '600',
  },
  convertGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  convertCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  convertIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  convertTitle: {
    ...Typography.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
});
