import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

const AI_TOOLS = [
  { id: 'generate', icon: 'sparkles', title: 'Generate Document', subtitle: 'Create professional documents from text prompts', route: '/generate' },
  { id: 'edit', icon: 'create', title: 'AI Edit', subtitle: 'Edit documents with natural language commands', route: '/edit' },
  { id: 'qa', icon: 'help-circle', title: 'AI Q&A', subtitle: 'Ask questions about your documents', route: '/qa' },
  { id: 'summarize', icon: 'reader', title: 'Summarize', subtitle: 'Create short summaries of long documents', route: '/summarize' },
  { id: 'style', icon: 'color-palette', title: 'Change Style', subtitle: 'Restyle any document with AI', route: '/change-style' },
];

export default function AIToolsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <AnimatedPressable onPress={() => router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>AI Tools</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.heroCard}>
            <Ionicons name="sparkles" size={48} color={Colors.white} />
            <Text style={styles.heroTitle}>AI-Powered Tools</Text>
            <Text style={styles.heroSubtitle}>Intelligent document processing at your fingertips</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <View style={styles.toolsList}>
            {AI_TOOLS.map((tool, index) => (
              <Animated.View key={tool.id} entering={FadeInDown.delay(200 + index * 60).duration(400)}>
                <AnimatedPressable
                  onPress={() => router.push(tool.route as any)}
                  haptic="light"
                  style={styles.toolCard}
                >
                  <View style={styles.toolIcon}>
                    <Ionicons name={tool.icon as any} size={24} color={Brand.navy} />
                  </View>
                  <View style={styles.toolInfo}>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                    <Text style={styles.toolSubtitle} numberOfLines={1}>{tool.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
                </AnimatedPressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.canvas },
  header: { backgroundColor: Brand.navy, paddingTop: 60, paddingBottom: Spacing.xxl, borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
  backBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...Typography.h2, color: Colors.white },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  heroCard: { backgroundColor: Brand.navy, borderRadius: Radius.xxl, padding: Spacing.xxl, alignItems: 'center', gap: Spacing.md, marginTop: -Spacing.xl, marginBottom: Spacing.xxl, ...Shadow.md },
  heroTitle: { ...Typography.h2, color: Colors.white },
  heroSubtitle: { ...Typography.caption, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  toolsList: { gap: Spacing.sm },
  toolCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, gap: Spacing.md, ...Shadow.sm },
  toolIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Brand.navy + '15', justifyContent: 'center', alignItems: 'center' },
  toolInfo: { flex: 1 },
  toolTitle: { ...Typography.body, fontWeight: '600', marginBottom: 2 },
  toolSubtitle: { ...Typography.caption },
});
