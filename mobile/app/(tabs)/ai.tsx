import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { BentoCard } from '../../components/ui/BentoCard';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useFileStore } from '../../store/file-store';
import { SwipeableFileCard } from '../../components/ui/SwipeableFileCard';

const AI_TOOLS = [
  { id: 'generate', icon: 'document-text', color: Colors.primary, title: 'Generate Document', subtitle: 'Create from text prompts', route: '/generate' },
  { id: 'voice', icon: 'mic', color: Colors.action, title: 'Voice to Doc', subtitle: 'Record and convert', route: '/voice' },
  { id: 'translate', icon: 'globe', color: Colors.teal, title: 'Translate', subtitle: '10+ languages', route: '/translate' },
];

const QUICK_TOOLS = [
  { id: 'scan', icon: 'camera', color: Colors.amber, title: 'Scan', route: '/camera/scanner' },
  { id: 'ocr', icon: 'text', color: Colors.emerald, title: 'OCR', route: '/camera/ocr' },
  { id: 'style', icon: 'color-palette', color: Colors.indigo, title: 'Style', route: '/change-style' },
  { id: 'summarize', icon: 'reader', color: Colors.action, title: 'Summarize', route: '/summarize' },
  { id: 'qa', icon: 'help-circle', color: Colors.primary, title: 'Q&A', route: '/qa' },
];

export default function AIGenerateScreen() {
  const router = useRouter();
  const { files, isLoading } = useFileStore();
  const recentFiles = files.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Generate</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.toolsGrid}>
            <BentoCard
              variant="hero"
              color={Colors.bentoPrimary}
              icon="sparkles"
              title="Generate Document"
              subtitle="Create professional documents from text prompts"
              onPress={() => router.push('/generate' as any)}
              badge={{ text: 'AI', color: Colors.action }}
            />
            <View style={styles.toolRow}>
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
            <Text style={styles.sectionTitle}>Quick Tools</Text>
            <View style={styles.quickGrid}>
              {QUICK_TOOLS.map((tool) => (
                <AnimatedPressable
                  key={tool.id}
                  onPress={() => router.push(tool.route as any)}
                  haptic="light"
                  style={styles.quickPill}
                >
                  <View style={[styles.quickIcon, { backgroundColor: tool.color + '15' }]}>
                    <Ionicons name={tool.icon as any} size={18} color={tool.color} />
                  </View>
                  <Text style={[styles.quickText, { color: tool.color }]}>{tool.title}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Documents</Text>
              <Text style={styles.sectionCount}>{recentFiles.length}</Text>
            </View>

            {isLoading ? (
              <SkeletonLoader variant="listItem" count={2} />
            ) : recentFiles.length === 0 ? (
              <EmptyState
                icon="document-text"
                title="No recent documents"
                subtitle="Your generated documents will appear here"
                actionLabel="Generate Now"
                onAction={() => router.push('/generate' as any)}
              />
            ) : (
              <View style={styles.fileList}>
                {recentFiles.map((file, index) => (
                  <Animated.View
                    key={file.id}
                    entering={FadeInDown.delay(400 + index * 80).duration(400)}
                  >
                    <SwipeableFileCard
                      file={{
                        id: file.id,
                        name: file.title,
                        format: file.format,
                        date: new Date(file.createdAt).toLocaleDateString(),
                      }}
                      onPress={() => {}}
                      onShare={() => {}}
                      onFavorite={() => {}}
                      onDelete={() => {}}
                      onConvert={() => router.push('/convert' as any)}
                    />
                  </Animated.View>
                ))}
              </View>
            )}
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
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    ...Typography.h1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
  toolsGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  toolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
  },
  sectionCount: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  fileList: {
    gap: Spacing.sm,
  },
});
