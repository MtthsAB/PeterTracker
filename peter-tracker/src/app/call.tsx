import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font } from '../theme/tokens';
import { usePeter } from '../store/usePeter';
import { Avatar, type IconName } from '../components/ui';

const NO_ANSWER_MS = 45000;

function Ring({ delay }: { delay: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 1, duration: 2000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return (
    <Animated.View
      style={[
        s.ring,
        {
          opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
          transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] }) }],
        },
      ]}
    />
  );
}

function Action({ icon, label, active, onPress }: { icon: IconName; label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable style={s.action} onPress={onPress} accessibilityState={{ selected: active }}>
      <View style={[s.actionIcon, active && { backgroundColor: colors.text }]}>
        <MaterialIcons name={icon} size={26} color={active ? colors.bg : colors.text} />
      </View>
      <Text style={s.actionLabel}>{label}</Text>
    </Pressable>
  );
}

export default function Call() {
  const router = useRouter();
  const status = usePeter((st) => st.status);
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  const hangUp = () => router.replace('/chat?danger=1');

  useEffect(() => {
    const tick = setInterval(() => setSecs((x) => x + 1), 1000);
    const timeout = setTimeout(hangUp, NO_ANSWER_MS);
    return () => {
      clearInterval(tick);
      clearTimeout(timeout);
    };
  }, []);

  const mmss = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.center}>
        <View style={s.avatarWrap}>
          <Ring delay={0} />
          <Ring delay={1000} />
          <Avatar size={120} />
        </View>
        <Text style={s.name}>Peter Parker</Text>
        <Text style={s.status}>Chamando… {mmss}</Text>
        {status && (
          <View style={s.chip}>
            <MaterialIcons name="place" size={14} color={colors.redSoft} />
            <Text style={s.chipText}>{status.address}</Text>
          </View>
        )}
      </View>

      <View style={s.actions}>
        <Action icon={muted ? 'mic-off' : 'mic'} label="Mudo" active={muted} onPress={() => setMuted(!muted)} />
        <Action icon="volume-up" label="Alto-falante" active={speaker} onPress={() => setSpeaker(!speaker)} />
        <Action icon="chat" label="Chat" onPress={() => router.back()} />
      </View>

      <Pressable style={s.end} onPress={hangUp} accessibilityLabel="Encerrar chamada">
        <MaterialIcons name="call-end" size={32} color={colors.text} />
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 32 },
  center: { alignItems: 'center', gap: 10, marginTop: 60 },
  avatarWrap: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  ring: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: colors.red },
  name: { color: colors.text, fontFamily: font.display, fontSize: 34 },
  status: { color: colors.textMuted, fontFamily: font.medium, fontSize: 15 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surface,
    borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, marginTop: 6,
  },
  chipText: { color: colors.textSoft, fontFamily: font.medium, fontSize: 12 },
  actions: { flexDirection: 'row', gap: 32 },
  action: { alignItems: 'center', gap: 8 },
  actionIcon: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: colors.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { color: colors.textSoft, fontFamily: font.medium, fontSize: 12 },
  end: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.red,
    alignItems: 'center', justifyContent: 'center',
  },
});
