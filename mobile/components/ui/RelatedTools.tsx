import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '../../lib/theme';
import { AnimatedPressable } from './AnimatedPressable';

interface Tool {
  id: string;
  icon: string;
  color: string;
  title: string;
  route: string;
}

interface RelatedToolsProps {
  tools: Tool[];
  onToolPress: (route: string) => void;
}

export function RelatedTools({ tools, onToolPress }: RelatedToolsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>More Tools</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tools.map((tool) => (
          <AnimatedPressable
            key={tool.id}
            onPress={() => onToolPress(tool.route)}
            haptic="light"
            style={styles.toolCard}
          >
            <View style={[styles.toolIcon, { backgroundColor: tool.color + '15' }]}>
              <Ionicons name={tool.icon as any} size={18} color={tool.color} />
            </View>
            <Text style={styles.toolTitle}>{tool.title}</Text>
          </AnimatedPressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xxl,
  },
  title: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  scrollContent: {
    gap: Spacing.sm,
  },
  toolCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 80,
    gap: Spacing.xs,
  },
  toolIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTitle: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 10,
    textAlign: 'center',
  },
});
