import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, radius } from '../../theme/tokens';
import { relTime, useAddress, usePeter } from '../../store/usePeter';
import { triggerEmergency, type EmergencyTarget } from '../../services/api';
import { Card, IconButton, InfoRow, SectionLabel } from '../../components/ui';
import { HoldToConfirmButton } from '../../components/HoldToConfirmButton';

const TARGETS: { key: EmergencyTarget; label: string; sub: string }[] = [
  { key: '911', label: 'Emergência (911)', sub: 'Polícia, bombeiros e ambulância' },
  { key: 'delegacia', label: 'Delegacia mais próxima', sub: 'NYPD 112th Precinct · 1,2 km' },
];

export default function Emergencia() {
  const router = useRouter();
  const status = usePeter((st) => st.status);
  const address = useAddress(status?.coords, status?.address);
  const [target, setTarget] = useState<EmergencyTarget>('911');
  const [sending, setSending] = useState(false);

  const confirm = async () => {
    if (!status) return;
    setSending(true);
    try {
      const r = await triggerEmergency({ target, coords: status.coords });
      router.replace({ pathname: '/emergencia/confirmado', params: r });
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={s.header}>
        <IconButton icon="close" label="Fechar" onPress={() => router.back()} />
        <Text style={s.title}>Acionar autoridades</Text>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Card style={{ paddingVertical: 6 }}>
          <InfoRow icon="place" label="Localização" value={address || '—'} />
          <InfoRow icon="schedule" label="Último sinal" value={status ? relTime(status.updatedAt) : '—'} />
          <InfoRow icon="person" label="Contato responsável" value="Mary Jane Watson" sub="(212) 555-0187" />
        </Card>

        <SectionLabel>Enviar para</SectionLabel>
        {TARGETS.map((t) => {
          const on = t.key === target;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTarget(t.key)}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              style={[s.radio, on && { borderColor: colors.red, backgroundColor: colors.redBg }]}
            >
              <MaterialIcons
                name={on ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={22}
                color={on ? colors.redSoft : colors.textMuted}
              />
              <View style={{ flex: 1 }}>
                <Text style={s.radioLabel}>{t.label}</Text>
                <Text style={s.radioSub}>{t.sub}</Text>
              </View>
            </Pressable>
          );
        })}

        <Text style={s.warn}>
          Use apenas em emergências reais. Sua localização e a de Peter serão compartilhadas.
        </Text>
      </ScrollView>

      <View style={{ padding: 16 }}>
        <HoldToConfirmButton
          title={sending ? 'Enviando…' : 'Segure para acionar'}
          onConfirm={confirm}
          disabled={sending || !status}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  title: { color: colors.text, fontFamily: font.display, fontSize: 24 },
  content: { padding: 16, paddingTop: 0, gap: 12 },
  radio: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  radioLabel: { color: colors.text, fontFamily: font.semibold, fontSize: 15 },
  radioSub: { color: colors.textMuted, fontFamily: font.body, fontSize: 13 },
  warn: { color: colors.textMuted, fontFamily: font.body, fontSize: 13, textAlign: 'center', marginTop: 8 },
});
