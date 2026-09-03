import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { BentoCard } from '../../components/ui/BentoCard';

const AI_TOOLS = [
  { id: 'generate', icon: 'document-text', color: Colors.primary, title: 'Generate Document', subtitle: 'Create professional documents from text prompts', route: '/generate' },
  { id: 'voice', icon: 'mic', color: Colors.action, title: 'Voice to Doc', subtitle: 'Record and convert speech to text', route: '/voice' },
  { id: 'translate', icon: 'globe', color: Colors.teal, title: 'Translate', subtitle: 'Translate documents between 10+ languages', route: '/translate' },
  { id: 'ocr', icon: 'scan', color: Colors.emerald, title: 'Extract Text', subtitle: 'Pull text from images and PDFs', route: '/camera/ocr' },
  { id: 'style', icon: 'color-palette', color: Colors.indigo, title: 'Change Style', subtitle: 'Restyle any document with AI', route: '/change-style' },
  { id: 'summarize', icon: 'reader', color: Colors.amber, title: 'Summarize', subtitle: 'Create short summaries of long docs', route: '/summarize' },
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
          <View style={styles.bentoGrid}>
            <BentoCard
              variant="hero"
              color={Colors.bentoPrimary}
              icon="sparkles"
              title="Generate Document"
              subtitle="Create professional documents from text prompts"
              onPress={() => router.push('/generate' as any)}
              badge={{ text: 'AI', color: Colors.action }}
            />
            <View style={styles.bentoRow}>
              <BentoCard
                variant="standard"
                color={Colors.bentoAccent}
                icon="mic"
                title="Voice to Doc"
                subtitle="Record and convert"
                onPress={() => router.push('/voice' as any)}
              />
              <BentoCard
                variant="standard"
                color={Colors.teal}
                icon="globe"
                title="Translate"
                subtitle="10+ languages"
                onPress={() => router.push('/translate' as any)}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tools</Text>
            <View style={styles.toolsGrid}>
              {AI_TOOLS.slice(2).map((tool) => (
                <AnimatedPressable
                  key={tool.id}
                  onPress={() => router.push(tool.route as any)}
                  haptic="light"
                  style={styles.toolCard}
                >
                  <View style={[styles.toolIcon, { backgroundColor: tool.color + '15' }]}>
                    <Ionicons name={tool.icon as any} size={22} color={tool.color} />
                  </View>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  <Text style={styles.toolSubtitle} numberOfLines={1}>{tool.subtitle}</Text>
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
  bentoGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  bentoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  toolsGrid: {
    gap: Spacing.sm,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  toolIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTitle: {
    ...Typography.body,
    fontWeight: '600',
    flex: 1,
  },
  toolSubtitle: {
    ...Typography.caption,
    flex: 2,
  },
});
