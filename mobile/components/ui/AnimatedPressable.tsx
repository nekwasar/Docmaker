import { useCallback } from 'react';
import { Pressable, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Animation } from '../../lib/theme';

interface AnimatedPressableProps {
  onPress?: () => void;
  onLongPress?: () => void;
  scale?: number;
  haptic?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection' | 'none';
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const AnimatedPressableComponent = Animated.createAnimatedComponent(Pressable);

export function AnimatedPressable({
  onPress,
  onLongPress,
  scale = Animation.pressScale,
  haptic = 'light',
  disabled = false,
  children,
  style,
  contentStyle,
}: AnimatedPressableProps) {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const triggerHaptic = useCallback(() => {
    if (haptic === 'none') return;
    switch (haptic) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'selection':
        Haptics.selectionAsync();
        break;
    }
  }, [haptic]);

  const handlePressIn = useCallback(() => {
    scaleValue.value = withSpring(scale, Animation.springConfig);
  }, [scale, scaleValue]);

  const handlePressOut = useCallback(() => {
    scaleValue.value = withSpring(1, Animation.springConfig);
  }, [scaleValue]);

  const handlePress = useCallback(() => {
    triggerHaptic();
    onPress?.();
  }, [triggerHaptic, onPress]);

  const handleLongPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onLongPress?.();
  }, [onLongPress]);

  return (
    <AnimatedPressableComponent
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[style, animatedStyle]}
    >
      <Animated.View style={contentStyle}>
        {children}
      </Animated.View>
    </AnimatedPressableComponent>
  );
}
