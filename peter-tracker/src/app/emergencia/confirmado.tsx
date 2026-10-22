import { useEffect } from 'react';
import { BackHandler, Linking, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font } from '../../theme/tokens';
import { hhmm } from '../../store/usePeter';
import { Card, OutlineButton, PrimaryButton, SectionLabel } from '../../components/ui';

export default function Confirmado() {
  const router = useRouter();
  const { protocol, sentAt, status } = useLocalSearchParams<{ protocol: string; sentAt: string; status: string }>();

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.top}>
        <View style={s.ring}>
          <MaterialIcons name="verified-user" size={48} color={colors.blue} />
        </View>
        <Text style={s.title}>Autoridades acionadas</Text>
        <Text style={s.text}>
          Enviamos a localização de Peter e seus dados de contato. Mantenha o celular por perto — a equipe
          pode ligar para você.
        </Text>
      </View>

      <Card style={{ gap: 14 }}>
        <Row label="Protocolo" value={protocol} />
        <Row label="Enviado às" value={sentAt ? hhmm(sentAt) : '—'} />
        <View style={s.row}>
          <SectionLabel>Status</SectionLabel>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={s.dot} />
            <Text style={s.value}>{status}</Text>
          </View>
        </View>
      </Card>

      <View style={{ gap: 10, marginTop: 'auto' }}>
        <PrimaryButton title="Acompanhar no mapa" icon="map" onPress={() => router.replace('/')} />
        <OutlineButton title="Ligar para o 911" icon="call" onPress={() => Linking.openURL('tel:911')} />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <View style={s.row}>
      <SectionLabel>{label}</SectionLabel>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 20, gap: 24 },
  top: { alignItems: 'center', gap: 12, marginTop: 40 },
  ring: {
    width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: colors.blue,
    backgroundColor: 'rgba(61,139,255,0.12)', alignItems: 'center', justifyContent: 'center',
  },
  title: { color: colors.text, fontFamily: font.display, fontSize: 30 },
  text: { color: colors.textSoft, fontFamily: font.body, fontSize: 15, textAlign: 'center', lineHeight: 21 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  value: { color: colors.text, fontFamily: font.semibold, fontSize: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green },
});
