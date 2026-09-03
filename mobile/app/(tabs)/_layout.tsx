import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadow } from '../../lib/theme';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.borderSolid,
          borderTopWidth: 1,
          height: 80,
          paddingTop: 12,
          paddingBottom: 20,
          ...Shadow.tab,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="folder" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="transfer"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.85, { damping: 10, stiffness: 200 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons
        name={focused ? name : `${name}-outline` as any}
        size={28}
        color={focused ? Colors.primary : Colors.textSecondary}
      />
    </Animated.View>
  );
}
