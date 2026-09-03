import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Brand, Spacing, Radius, Shadow, Typography } from '../../lib/theme';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

export default function TransferScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'send' | 'receive' | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <AnimatedPressable onPress={() => mode ? setMode(null) : router.back()} haptic="light" style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Transfer</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      {!mode ? (
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <View style={styles.heroCard}>
              <Ionicons name="swap-horizontal" size={48} color={Colors.textPrimary} />
              <Text style={styles.heroTitle}>File Transfer</Text>
              <Text style={styles.heroSubtitle}>Send files between your devices</Text>
            </View>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.cards}>
            <AnimatedPressable onPress={() => setMode('send')} haptic="light" style={styles.card}>
              <View style={styles.cardIcon}><Ionicons name="arrow-up" size={32} color={Brand.yellow} /></View>
              <Text style={styles.cardTitle}>Send Files</Text>
              <Text style={styles.cardSubtitle}>Share files to another device</Text>
            </AnimatedPressable>
            <AnimatedPressable onPress={() => setMode('receive')} haptic="light" style={styles.card}>
              <View style={styles.cardIcon}><Ionicons name="arrow-down" size={32} color={Brand.yellow} /></View>
              <Text style={styles.cardTitle}>Receive Files</Text>
              <Text style={styles.cardSubtitle}>Get files from another device</Text>
            </AnimatedPressable>
          </Animated.View>
        </View>
      ) : mode === 'send' ? (
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text style={styles.title}>Send Files</Text>
            <Text style={styles.subtitle}>Share this code with the receiving device</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.codeContainer}>
            <View style={styles.codeBox}><Text style={styles.code}>ABC123</Text></View>
            <Text style={styles.codeSubtext}>Expires in 24 hours</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.actionCards}>
            <AnimatedPressable onPress={() => {}} haptic="light" style={styles.actionCard}>
              <Ionicons name="qr-code" size={24} color={Brand.yellow} />
              <Text style={styles.actionText}>Show QR Code</Text>
            </AnimatedPressable>
            <AnimatedPressable onPress={() => {}} haptic="light" style={styles.actionCard}>
              <Ionicons name="share" size={24} color={Brand.yellow} />
              <Text style={styles.actionText}>Share Link</Text>
            </AnimatedPressable>
          </Animated.View>
        </View>
      ) : (
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text style={styles.title}>Receive Files</Text>
            <Text style={styles.subtitle}>Enter the code from the sending device</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.codeContainer}>
            <View style={styles.codeBox}><Text style={styles.codeInputText}>_ _ _ _ _ _</Text></View>
          </Animated.View>
          <AnimatedPressable onPress={() => {}} haptic="medium" style={styles.receiveBtn} disabled>
            <Text style={styles.receiveBtnText}>Receive Files</Text>
          </AnimatedPressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.canvas },
  header: { backgroundColor: Brand.yellow, paddingTop: 60, paddingBottom: Spacing.xl, borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
  backBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...Typography.h2, color: Colors.textPrimary },
  content: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxl },
  heroCard: { backgroundColor: Colors.white, borderRadius: Radius.xxl, padding: Spacing.xxl, alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  heroTitle: { ...Typography.h2 },
  heroSubtitle: { ...Typography.body, color: Colors.textSecondary },
  cards: { gap: Spacing.md },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, gap: Spacing.md, ...Shadow.sm },
  cardIcon: { width: 64, height: 64, borderRadius: Radius.full, backgroundColor: Brand.yellow + '15', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { ...Typography.h3 },
  cardSubtitle: { ...Typography.caption },
  title: { ...Typography.h1, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.xxxl },
  codeContainer: { alignItems: 'center', marginBottom: Spacing.xxxl },
  codeBox: { backgroundColor: Colors.white, borderRadius: Radius.xl, paddingHorizontal: Spacing.xxxl, paddingVertical: Spacing.xxl, borderWidth: 2, borderColor: Brand.yellow, borderStyle: 'dashed', ...Shadow.sm },
  code: { ...Typography.number, fontSize: 36, letterSpacing: 8, color: Brand.yellow },
  codeInputText: { ...Typography.number, fontSize: 36, letterSpacing: 8, color: Colors.textSecondary },
  codeSubtext: { ...Typography.caption, marginTop: Spacing.md },
  actionCards: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xxl },
  actionCard: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.white, borderRadius: Radius.xl, paddingVertical: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  actionText: { ...Typography.body, fontWeight: '600' },
  receiveBtn: { backgroundColor: Brand.yellow, borderRadius: Radius.full, paddingVertical: Spacing.lg, alignItems: 'center', ...Shadow.md },
  receiveBtnText: { ...Typography.body, color: Colors.textPrimary, fontWeight: '600' },
});
