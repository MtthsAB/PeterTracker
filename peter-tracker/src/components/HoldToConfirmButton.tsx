import { useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, font, radius } from '../theme/tokens';

export function HoldToConfirmButton({ title, onConfirm, duration = 3000, disabled }: {
  title: string; onConfirm: () => void; duration?: number; disabled?: boolean;
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const [holding, setHolding] = useState(false);

  const start = () => {
    setHolding(true);
    Haptics.selectionAsync();
    Animated.timing(progress, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: false })
      .start(({ finished }) => {
        if (!finished) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onConfirm();
      });
  };
  const cancel = () => {
    setHolding(false);
    progress.stopAnimation();
    Animated.timing(progress, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  return (
    <Pressable
      onPressIn={start}
      onPressOut={cancel}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityHint={`Segure por ${duration / 1000} segundos para confirmar`}
      style={[s.btn, disabled && { opacity: 0.5 }]}
    >
      <Animated.View
        style={[s.fill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
      />
      <MaterialIcons name="shield" size={22} color={colors.text} />
      <Text style={s.text}>{holding ? 'Continue segurando…' : title}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    height: 58, borderRadius: radius.md, backgroundColor: colors.red, overflow: 'hidden',
    flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center',
  },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.18)' },
  text: { color: colors.text, fontFamily: font.bold, fontSize: 15, letterSpacing: 0.5 },
});
