import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';

const AI_TOOLS = [
  { id: 'generate', icon: 'document-text', color: Colors.primary, title: 'Generate Document', subtitle: 'Create from text', route: '/generate' },
  { id: 'voice', icon: 'mic', color: Colors.action, title: 'Voice to Doc', subtitle: 'Record and convert', route: '/voice' },
  { id: 'translate', icon: 'globe', color: Colors.teal, title: 'Translate', subtitle: '10+ languages', route: '/translate' },
];

const QUICK_TOOLS = [
  { id: 'scan', icon: 'camera', color: Colors.amber, title: 'Scan' },
  { id: 'ocr', icon: 'text', color: Colors.emerald, title: 'OCR' },
  { id: 'style', icon: 'color-palette', color: Colors.indigo, title: 'Style' },
  { id: 'summarize', icon: 'reader', color: Colors.action, title: 'Summarize' },
  { id: 'qa', icon: 'help-circle', color: Colors.primary, title: 'Q&A' },
];

export default function AIGenerateScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Generate</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.toolsGrid}>
          {AI_TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              activeOpacity={0.7}
              onPress={() => router.push(tool.route as any)}
            >
              <View style={[styles.toolIcon, { backgroundColor: tool.color + '15' }]}>
                <Ionicons name={tool.icon as any} size={28} color={tool.color} />
              </View>
              <Text style={styles.toolTitle}>{tool.title}</Text>
              <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tools</Text>
          <View style={styles.quickGrid}>
            {QUICK_TOOLS.map((tool) => (
              <TouchableOpacity key={tool.id} style={styles.quickPill} activeOpacity={0.7}>
                <Ionicons name={tool.icon as any} size={18} color={tool.color} />
                <Text style={[styles.quickText, { color: tool.color }]}>{tool.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Documents</Text>
          <View style={styles.emptyRecent}>
            <Text style={styles.emptyText}>No recent documents</Text>
          </View>
        </View>
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
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  toolCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  toolIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  toolTitle: {
    ...Typography.h3,
    marginBottom: 2,
  },
  toolSubtitle: {
    ...Typography.caption,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  emptyRecent: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xxxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    ...Typography.caption,
  },
});
