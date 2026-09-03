import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadow } from '../../lib/theme';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.borderSolid,
          borderTopWidth: 1,
          height: 88,
          paddingBottom: 28,
          paddingTop: 8,
          ...Shadow.tab,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarActiveLabelStyle: {
          color: Colors.primary,
        },
        tabBarInactiveLabelStyle: {
          color: Colors.textSecondary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Files',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="folder" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="sparkles" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="transfer"
        options={{
          title: 'Transfer',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="swap-horizontal" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="person" focused={focused} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, focused, color, size }: { name: string; focused: boolean; color: string; size: number }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.8, { damping: 10, stiffness: 200 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons
        name={focused ? name : `${name}-outline` as any}
        size={size}
        color={color}
      />
    </Animated.View>
  );
}
